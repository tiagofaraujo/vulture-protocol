"use client";

import { useEffect, useMemo, useState } from "react";

import { ScannerControls } from "@/components/scanner-controls";
import { TokenTable } from "@/components/token-table";
import {
  filterAndSortTokens,
  ScannerSortOption,
  ScannerStatusFilter,
} from "@/lib/token-scanner";
import { TokenRow } from "@/types/token";

const scoreThresholdOptions = [0, 40, 60, 80] as const;

export default function DashboardPage() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScannerStatusFilter>("all");
  const [chainFilter, setChainFilter] = useState("all");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [sortOption, setSortOption] = useState<ScannerSortOption>("score_desc");

  useEffect(() => {
    async function loadTokens() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetch("/api/tokens");

        if (!response.ok) {
          throw new Error("Failed to load scanner tokens.");
        }

        const payload = (await response.json()) as { tokens?: TokenRow[] };

        if (!payload.tokens) {
          throw new Error("Invalid token response.");
        }

        setTokens(payload.tokens);
      } catch (_error) {
        setLoadError("Failed to load token data. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTokens();
  }, []);

  const chainOptions = useMemo(() => {
    return [...new Set(tokens.map((token) => token.chain))].sort((a, b) => a.localeCompare(b));
  }, [tokens]);

  const { filteredRows, sortedRows } = useMemo(() => {
    return filterAndSortTokens(tokens, {
      searchQuery,
      statusFilter,
      chainFilter,
      minScoreFilter,
      sortOption,
    });
  }, [tokens, searchQuery, statusFilter, chainFilter, minScoreFilter, sortOption]);

  const avgDrawdown =
    filteredRows.length > 0
      ? filteredRows.reduce((sum, row) => sum + row.drawdownPercent, 0) / filteredRows.length
      : 0;

  const topScore =
    filteredRows.length > 0
      ? Math.max(...filteredRows.map((row) => row.resurrectionScore))
      : 0;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="mb-12 space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-50">Vulture Protocol</p>
        <h1 className="text-4xl font-bold tracking-tight">Solana Graveyard Scanner</h1>
        <p className="mt-2 text-slate-300">
          Track dead, zombie, and resurrection tokens across the Solana ecosystem.
        </p>
      </div>

      <section className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700">
            <p className="text-sm text-slate-400">Tracked Tokens</p>
            <p className="mt-1 text-3xl font-bold">{filteredRows.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700">
            <p className="text-sm text-slate-400">Avg. Drawdown</p>
            <p className="mt-1 text-3xl font-bold">{avgDrawdown.toFixed(2)}%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700">
            <p className="text-sm text-slate-400">Top Score</p>
            <p className="mt-1 text-3xl font-bold">{topScore}</p>
          </div>
        </div>

        <ScannerControls
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          chainFilter={chainFilter}
          onChainFilterChange={setChainFilter}
          minScoreFilter={minScoreFilter}
          onMinScoreFilterChange={setMinScoreFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          chainOptions={chainOptions}
          scoreThresholdOptions={scoreThresholdOptions}
        />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Graveyard Tokens</h2>
          <p className="text-slate-300">
            Solana tokens with extreme drawdowns and potential resurrection signals.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300">
            Loading scanner data...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-100">Unable to load tokens</h3>
            <p className="mt-2 text-slate-400">{loadError}</p>
          </div>
        ) : sortedRows.length > 0 ? (
          <TokenTable rows={sortedRows} />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-100">No matching tokens</h3>
            <p className="mt-2 text-slate-400">
              Try changing the scanner filters to broaden the results.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
