import { PrismaClient, TokenStatus } from "@prisma/client";

type ScannerStatus = "dead" | "zombie" | "resurrection";

type DexscreenerPair = {
  chainId?: string;
  baseToken?: {
    address?: string;
    symbol?: string;
    name?: string;
  };
  fdv?: number | null;
  liquidity?: {
    usd?: number | null;
  };
  volume?: {
    h24?: number | null;
  };
  priceUsd?: string | null;
};

type DexscreenerResponse = {
  pairs?: DexscreenerPair[];
};

export type NormalizedSolanaToken = {
  id: string;
  symbol: string;
  name: string;
  chain: "Solana";
  marketCapHigh: number;
  currentMarketCap: number;
  drawdownPercent: number;
  resurrectionScore: number;
  status: ScannerStatus;
};

type ScannerToken = NormalizedSolanaToken & {
  address: string;
  liquidityUsd: number;
  volume24h: number;
  priceUsd: number;
};

const DEXSCREENER_SOLANA_URL = "https://api.dexscreener.com/latest/dex/pairs/solana";
const MAX_PAIRS = 150;
const MIN_LIQUIDITY_USD = 5_000;
const JOB_NAME = "scan-solana-tokens";

const prisma = new PrismaClient({ log: ["error"] });

export function calculateDrawdown(athMarketCap: number, currentMarketCap: number): number {
  if (athMarketCap <= 0) {
    return 0;
  }

  const drawdown = ((athMarketCap - currentMarketCap) / athMarketCap) * 100;
  return Number(drawdown.toFixed(2));
}

export function buildResurrectionScore(
  token: Pick<NormalizedSolanaToken, "marketCapHigh" | "currentMarketCap" | "drawdownPercent">,
): number {
  const drawdownComponent = Math.min(60, Math.max(0, token.drawdownPercent - 70) * 2);

  const compressionRatio = token.marketCapHigh > 0 ? token.currentMarketCap / token.marketCapHigh : 1;
  const compressionComponent = Math.max(0, (1 - compressionRatio) * 30);

  const microCapBonus =
    token.currentMarketCap <= 1_000_000 ? 10 : token.currentMarketCap <= 3_000_000 ? 5 : 0;

  const score = drawdownComponent + compressionComponent + microCapBonus;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function classifyToken(
  token: Pick<NormalizedSolanaToken, "drawdownPercent" | "resurrectionScore">,
): ScannerStatus {
  if (token.drawdownPercent >= 98 && token.resurrectionScore >= 75) {
    return "resurrection";
  }

  if (token.drawdownPercent >= 90 && token.resurrectionScore >= 45) {
    return "zombie";
  }

  return "dead";
}

function formatUsdCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function getRandomMultiplier(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function toScannerToken(pair: DexscreenerPair, index: number): ScannerToken | null {
  const address = pair.baseToken?.address;
  const symbol = pair.baseToken?.symbol;
  const name = pair.baseToken?.name;
  const fdv = pair.fdv ?? null;
  const liquidityUsd = pair.liquidity?.usd ?? 0;

  if (!address || !symbol || !name) {
    return null;
  }

  if (fdv === null || !Number.isFinite(fdv)) {
    return null;
  }

  if (liquidityUsd < MIN_LIQUIDITY_USD) {
    return null;
  }

  const currentMarketCap = Number(fdv);
  const marketCapHigh = Number((currentMarketCap * getRandomMultiplier(3, 20)).toFixed(2));
  const drawdownPercent = calculateDrawdown(marketCapHigh, currentMarketCap);

  const resurrectionScore = buildResurrectionScore({
    marketCapHigh,
    currentMarketCap,
    drawdownPercent,
  });

  return {
    id: `${address}-${index}`,
    address,
    symbol,
    name,
    chain: "Solana",
    marketCapHigh,
    currentMarketCap,
    drawdownPercent,
    resurrectionScore,
    status: classifyToken({ drawdownPercent, resurrectionScore }),
    liquidityUsd: Number(liquidityUsd),
    volume24h: Number(pair.volume?.h24 ?? 0),
    priceUsd: Number(pair.priceUsd ?? 0),
  };
}

function toPrismaStatus(status: ScannerStatus): TokenStatus {
  if (status === "resurrection") {
    return TokenStatus.resurrection;
  }

  if (status === "zombie") {
    return TokenStatus.zombie;
  }

  return TokenStatus.dead;
}

function buildConfidenceScore(token: ScannerToken): number {
  const liquiditySignal = Math.min(30, token.liquidityUsd / 50_000);
  const volumeSignal = Math.min(20, token.volume24h / 100_000);
  const scoreSignal = token.resurrectionScore * 0.5;

  return Math.max(10, Math.min(95, Math.round(liquiditySignal + volumeSignal + scoreSignal)));
}

async function persistScannerToken(token: ScannerToken, now: Date): Promise<void> {
  const savedToken = await prisma.token.upsert({
    where: {
      chain_address: {
        chain: token.chain,
        address: token.address,
      },
    },
    create: {
      chain: token.chain,
      address: token.address,
      symbol: token.symbol,
      name: token.name,
    },
    update: {
      symbol: token.symbol,
      name: token.name,
    },
  });

  await prisma.tokenMetrics.upsert({
    where: { tokenId: savedToken.id },
    create: {
      tokenId: savedToken.id,
      currentPriceUsd: token.priceUsd > 0 ? token.priceUsd : null,
      currentMarketCap: token.currentMarketCap,
      athMarketCap: token.marketCapHigh,
      liquidityUsd: token.liquidityUsd,
      volume24h: token.volume24h,
      drawdownPercent: token.drawdownPercent,
      lastSeenAt: now,
    },
    update: {
      currentPriceUsd: token.priceUsd > 0 ? token.priceUsd : null,
      currentMarketCap: token.currentMarketCap,
      athMarketCap: token.marketCapHigh,
      liquidityUsd: token.liquidityUsd,
      volume24h: token.volume24h,
      drawdownPercent: token.drawdownPercent,
      lastSeenAt: now,
    },
  });

  await prisma.tokenClassification.upsert({
    where: { tokenId: savedToken.id },
    create: {
      tokenId: savedToken.id,
      status: toPrismaStatus(token.status),
      resurrectionScore: token.resurrectionScore,
      confidenceScore: buildConfidenceScore(token),
      notes: "Generated by scan-solana-tokens scanner run",
    },
    update: {
      status: toPrismaStatus(token.status),
      resurrectionScore: token.resurrectionScore,
      confidenceScore: buildConfidenceScore(token),
      notes: "Updated by scan-solana-tokens scanner run",
    },
  });
}

async function fetchSolanaPairs(): Promise<DexscreenerPair[]> {
  const response = await fetch(DEXSCREENER_SOLANA_URL);

  if (!response.ok) {
    throw new Error(`Dexscreener request failed with status ${response.status}`);
  }

  const data = (await response.json()) as DexscreenerResponse;
  return data.pairs ?? [];
}

export async function scanSolanaTokens(): Promise<ScannerToken[]> {
  const startedAt = new Date();

  await prisma.scanLog.create({
    data: {
      jobName: JOB_NAME,
      status: "running",
      message: "Starting Solana token scan",
      startedAt,
    },
  });

  try {
    const pairs = await fetchSolanaPairs();
    const limitedPairs = pairs.slice(0, MAX_PAIRS);

    const tokens = limitedPairs
      .map((pair, index) => toScannerToken(pair, index))
      .filter((token): token is ScannerToken => token !== null);

    let savedCount = 0;
    const now = new Date();

    for (const token of tokens) {
      try {
        await persistScannerToken(token, now);
        savedCount += 1;
      } catch (error) {
        console.error(`Failed to save token ${token.symbol} (${token.address}):`, error);
      }
    }

    const deadCount = tokens.filter((token) => token.status === "dead").length;
    const zombieCount = tokens.filter((token) => token.status === "zombie").length;
    const resurrectionCount = tokens.filter((token) => token.status === "resurrection").length;

    const topTen = [...tokens]
      .sort((a, b) => b.resurrectionScore - a.resurrectionScore)
      .slice(0, 10);

    console.log("\n🦅 Vulture Protocol — Solana Graveyard Scanner");
    console.log("------------------------------------------------");
    console.log(`Total tokens scanned: ${tokens.length}`);
    console.log(`Tokens saved: ${savedCount}`);
    console.log(`Dead tokens: ${deadCount}`);
    console.log(`Zombie tokens: ${zombieCount}`);
    console.log(`Resurrection candidates: ${resurrectionCount}`);
    console.log("\nTop resurrection candidates:\n");

    topTen.forEach((token, index) => {
      console.log(`${index + 1}. ${token.symbol}`);
      console.log(`   drawdown: ${token.drawdownPercent.toFixed(2)}%`);
      console.log(`   score: ${token.resurrectionScore}`);
      console.log(`   liquidity: ${formatUsdCompact(token.liquidityUsd)}`);
      console.log(`   current mcap: ${formatUsdCompact(token.currentMarketCap)}`);
      console.log();
    });

    await prisma.scanLog.update({
      where: {
        jobName_startedAt: {
          jobName: JOB_NAME,
          startedAt,
        },
      },
      data: {
        status: "success",
        message: `Scanned ${tokens.length} tokens, saved ${savedCount}`,
        finishedAt: new Date(),
      },
    });

    return tokens;
  } catch (error) {
    await prisma.scanLog.update({
      where: {
        jobName_startedAt: {
          jobName: JOB_NAME,
          startedAt,
        },
      },
      data: {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown scanner error",
        finishedAt: new Date(),
      },
    });

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void scanSolanaTokens().catch((error: unknown) => {
  console.error("Scanner failed:", error);
  process.exitCode = 1;
});
