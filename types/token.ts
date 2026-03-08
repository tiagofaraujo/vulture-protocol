export type TokenStatus = "dead" | "zombie" | "resurrection";

export type TokenRow = {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  marketCapHigh: number;
  currentMarketCap: number;
  drawdownPercent: number;
  resurrectionScore: number;
  status: TokenStatus;
};
