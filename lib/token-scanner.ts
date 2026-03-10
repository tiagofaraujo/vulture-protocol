import { TokenRow, TokenStatus } from "@/types/token";

export type ScannerStatusFilter = "all" | TokenStatus;
export type ScannerSortOption =
  | "score_desc"
  | "drawdown_desc"
  | "peak_mcap_desc"
  | "current_mcap_asc"
  | "current_mcap_desc"
  | "symbol_asc";

export const scannerSortOptions: { label: string; value: ScannerSortOption }[] = [
  { label: "Resurrection Score (High to Low)", value: "score_desc" },
  { label: "Drawdown (High to Low)", value: "drawdown_desc" },
  { label: "Peak Market Cap (High to Low)", value: "peak_mcap_desc" },
  { label: "Current Market Cap (Low to High)", value: "current_mcap_asc" },
  { label: "Current Market Cap (High to Low)", value: "current_mcap_desc" },
  { label: "Symbol (A–Z)", value: "symbol_asc" },
];

type ScannerParams = {
  searchQuery: string;
  statusFilter: ScannerStatusFilter;
  chainFilter: string;
  minScoreFilter: number;
  sortOption: ScannerSortOption;
};

export function getChainOptions(rows: TokenRow[]) {
  return [...new Set(rows.map((token) => token.chain))].sort((a, b) => a.localeCompare(b));
}

function sortRows(rows: TokenRow[], sortOption: ScannerSortOption) {
  const sorted = [...rows];

  sorted.sort((a, b) => {
    switch (sortOption) {
      case "score_desc":
        return b.resurrectionScore - a.resurrectionScore;
      case "drawdown_desc":
        return b.drawdownPercent - a.drawdownPercent;
      case "peak_mcap_desc":
        return b.marketCapHigh - a.marketCapHigh;
      case "current_mcap_asc":
        return a.currentMarketCap - b.currentMarketCap;
      case "current_mcap_desc":
        return b.currentMarketCap - a.currentMarketCap;
      case "symbol_asc":
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  return sorted;
}

export function filterAndSortTokens(rows: TokenRow[], params: ScannerParams) {
  const normalizedQuery = params.searchQuery.trim().toLowerCase();

  const filteredRows = rows.filter((token) => {
    const matchesStatus = params.statusFilter === "all" || token.status === params.statusFilter;
    const matchesChain = params.chainFilter === "all" || token.chain === params.chainFilter;
    const matchesScore = token.resurrectionScore >= params.minScoreFilter;
    const matchesSearch =
      normalizedQuery.length === 0 ||
      token.symbol.toLowerCase().includes(normalizedQuery) ||
      token.name.toLowerCase().includes(normalizedQuery) ||
      token.chain.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesChain && matchesScore && matchesSearch;
  });

  return {
    filteredRows,
    sortedRows: sortRows(filteredRows, params.sortOption),
  };
}
