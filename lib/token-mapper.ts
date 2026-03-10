import { Prisma } from "@prisma/client";

import { TokenRow } from "@/types/token";

type TokenWithRelations = Prisma.TokenGetPayload<{
  include: {
    metrics: true;
    classification: true;
  };
}>;

export function mapPrismaTokenToTokenRow(token: TokenWithRelations): TokenRow {
  return {
    id: token.id,
    symbol: token.symbol,
    name: token.name,
    chain: token.chain,
    marketCapHigh: token.metrics?.athMarketCap?.toNumber() ?? 0,
    currentMarketCap: token.metrics?.currentMarketCap?.toNumber() ?? 0,
    drawdownPercent: token.metrics?.drawdownPercent?.toNumber() ?? 0,
    resurrectionScore: token.classification?.resurrectionScore ?? 0,
    status: token.classification?.status ?? "dead",
  };
}
