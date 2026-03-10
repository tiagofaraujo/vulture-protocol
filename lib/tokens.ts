import { tokenRows } from "@/lib/data";
import { TokenRow, TokenStatus } from "@/types/token";

export function getAllTokens(): TokenRow[] {
  return [...tokenRows];
}

export function getTokenById(id: string): TokenRow | undefined {
  return tokenRows.find((token) => token.id === id);
}

export function getAvailableChains(): string[] {
  return [...new Set(tokenRows.map((token) => token.chain))].sort((a, b) => a.localeCompare(b));
}

export function getTokenCountsByStatus() {
  const counts: Record<TokenStatus, number> = {
    dead: 0,
    zombie: 0,
    resurrection: 0,
  };

  for (const token of tokenRows) {
    counts[token.status] += 1;
  }

  return {
    total: tokenRows.length,
    ...counts,
  };
}
