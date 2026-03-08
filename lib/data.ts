import { TokenRow } from "@/types/token";

export const tokenRows: TokenRow[] = [
  {
    id: "1",
    symbol: "RUGX",
    name: "Rug Phoenix",
    chain: "Solana",
    marketCapHigh: 125000000,
    currentMarketCap: 2200000,
    drawdownPercent: 98.24,
    resurrectionScore: 81,
    status: "resurrection",
  },
  {
    id: "2",
    symbol: "NOVA",
    name: "Nova Layer",
    chain: "Ethereum",
    marketCapHigh: 74000000,
    currentMarketCap: 1800000,
    drawdownPercent: 97.56,
    resurrectionScore: 68,
    status: "zombie",
  },
  {
    id: "3",
    symbol: "GRAV",
    name: "GraveFi",
    chain: "Base",
    marketCapHigh: 49000000,
    currentMarketCap: 310000,
    drawdownPercent: 99.37,
    resurrectionScore: 41,
    status: "dead",
  },
];
