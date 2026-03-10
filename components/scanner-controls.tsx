import { scannerSortOptions, ScannerSortOption, ScannerStatusFilter } from "@/lib/token-scanner";

type ScannerControlsProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: ScannerStatusFilter;
  onStatusFilterChange: (value: ScannerStatusFilter) => void;
  chainFilter: string;
  onChainFilterChange: (value: string) => void;
  minScoreFilter: number;
  onMinScoreFilterChange: (value: number) => void;
  sortOption: ScannerSortOption;
  onSortOptionChange: (value: ScannerSortOption) => void;
  chainOptions: string[];
  scoreThresholdOptions: readonly number[];
};

export function ScannerControls({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  chainFilter,
  onChainFilterChange,
  minScoreFilter,
  onMinScoreFilterChange,
  sortOption,
  onSortOptionChange,
  chainOptions,
  scoreThresholdOptions,
}: ScannerControlsProps) {
  return (
    <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="space-y-2 sm:col-span-2 lg:col-span-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by symbol or name"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-slate-600"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</span>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as ScannerStatusFilter)}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-600"
        >
          <option value="all">All</option>
          <option value="dead">Dead</option>
          <option value="zombie">Zombie</option>
          <option value="resurrection">Resurrection</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Chain</span>
        <select
          value={chainFilter}
          onChange={(event) => onChainFilterChange(event.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-600"
        >
          <option value="all">All Solana Segments</option>
          {chainOptions.map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Minimum Score</span>
        <select
          value={minScoreFilter}
          onChange={(event) => onMinScoreFilterChange(Number(event.target.value))}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-600"
        >
          {scoreThresholdOptions.map((scoreOption) => (
            <option key={scoreOption} value={scoreOption}>
              {scoreOption}+
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 sm:col-span-2 lg:col-span-5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Sort by</span>
        <select
          value={sortOption}
          onChange={(event) => onSortOptionChange(event.target.value as ScannerSortOption)}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-600"
        >
          {scannerSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
