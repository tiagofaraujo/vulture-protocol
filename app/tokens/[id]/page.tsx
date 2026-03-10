"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TokenRow } from "@/types/token";

type StatusTone = "dead" | "zombie" | "resurrection";

const statusStyles: Record<StatusTone, string> = {
  dead: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  zombie: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  resurrection: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

function formatScoreLabel(score: number) {
  if (score >= 75) {
    return "High";
  }

  if (score >= 55) {
    return "Moderate";
  }

  return "Low";
}

function formatCompression(drawdownPercent: number) {
  if (drawdownPercent >= 98) {
    return "Severe compression";
  }

  if (drawdownPercent >= 95) {
    return "Strong compression";
  }

  return "Moderate compression";
}

export default function TokenDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [token, setToken] = useState<TokenRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadToken() {
      try {
        setIsLoading(true);
        setLoadError(null);
        setNotFound(false);

        const response = await fetch(`/api/tokens/${id}`);

        if (response.status === 404) {
          setNotFound(true);
          setToken(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load token.");
        }

        const payload = (await response.json()) as { token?: TokenRow };

        if (!payload.token) {
          throw new Error("Invalid token response.");
        }

        setToken(payload.token);
      } catch (_error) {
        setLoadError("Failed to load token details. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadToken();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
          Loading token data...
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Unable to load token</h1>
          <p className="mt-2 text-slate-300">{loadError}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !token) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Token not found</h1>
          <p className="mt-2 text-slate-300">
            The requested graveyard token could not be found.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-300 transition hover:text-white"
      >
        ← Back to Dashboard
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{token.symbol}</h1>
            <p className="mt-2 text-lg text-slate-200">{token.name}</p>
            <p className="mt-1 text-sm text-slate-400">Chain: {token.chain}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                statusStyles[token.status]
              }`}
            >
              {token.status}
            </span>
            <p className="text-sm text-slate-400">Resurrection Score</p>
            <p className="text-3xl font-bold text-slate-100">{token.resurrectionScore}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Peak Market Cap</p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {compactCurrency.format(token.marketCapHigh)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Current Market Cap</p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {compactCurrency.format(token.currentMarketCap)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Drawdown</p>
          <p className="mt-2 text-2xl font-bold text-rose-300">-{token.drawdownPercent.toFixed(2)}%</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Resurrection Score</p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{token.resurrectionScore}</p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Token Overview</h2>
        <p className="mt-3 text-slate-300">
          {token.symbol} previously peaked around {compactCurrency.format(token.marketCapHigh)} and now
          sits near {compactCurrency.format(token.currentMarketCap)}, reflecting a drawdown of -
          {token.drawdownPercent.toFixed(2)}%. The scanner currently classifies this token as{" "}
          <span className="font-semibold capitalize text-slate-100">{token.status}</span> with a
          resurrection score of <span className="font-semibold text-slate-100">{token.resurrectionScore}</span>.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Scanner Signals</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Market Compression</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {formatCompression(token.drawdownPercent)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Revival Probability</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {formatScoreLabel(token.resurrectionScore)} probability signal
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Classification Status</p>
            <p className="mt-2 text-lg font-semibold capitalize text-slate-100">{token.status}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
