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

export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScannerStatusFilter>("all");
  const [chainFilter, setChainFilter] = useState("all");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
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

  const deadCount = filteredRows.filter((token) => token.status === "dead").length;
  const zombieCount = filteredRows.filter((token) => token.status === "zombie").length;
  const resurrectionCount = filteredRows.filter((token) => token.status === "resurrection").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-50">Vulture Protocol</p>
        <h1 className="text-4xl font-bold tracking-tight">Solana Token Scanner</h1>
        <p className="text-slate-300">
          Browse Solana graveyard tokens and review resurrection potential.
        </p>
      </header>

      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Total Tokens</p>
            <p className="mt-1 text-2xl font-bold text-slate-100">{filteredRows.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Dead Tokens</p>
            <p className="mt-1 text-2xl font-bold text-rose-300">{deadCount}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Zombie Tokens</p>
            <p className="mt-1 text-2xl font-bold text-amber-300">{zombieCount}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Resurrection Tokens</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{resurrectionCount}</p>
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

        {isLoading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300">
            Loading scanner data...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-100">Unable to load tokens</h2>
            <p className="mt-2 text-slate-400">{loadError}</p>
          </div>
        ) : sortedRows.length > 0 ? (
          <TokenTable rows={sortedRows} />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-100">No matching tokens</h2>
            <p className="mt-2 text-slate-400">
              Try adjusting the scanner filters to widen the results.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
