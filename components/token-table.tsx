import Link from "next/link";

import { TokenRow, TokenStatus } from "@/types/token";

type TokenTableProps = {
  rows: TokenRow[];
};

const statusStyles: Record<TokenStatus, string> = {
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

export function TokenTable({ rows }: TokenTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/95 text-xs uppercase tracking-[0.14em] text-slate-300">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Token</th>
              <th className="px-5 py-3.5 font-semibold">Chain</th>
              <th className="px-5 py-3.5 font-semibold">Peak MCap</th>
              <th className="px-5 py-3.5 font-semibold">Current MCap</th>
              <th className="px-5 py-3.5 font-semibold">Drawdown</th>
              <th className="px-5 py-3.5 font-semibold">Score</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <p className="text-base font-semibold text-slate-200">No tokens available</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Scanner results will appear here once data is loaded.
                  </p>
                </td>
              </tr>
            ) : (
              rows.map((token) => (
                <tr key={token.id} className="cursor-pointer transition-colors hover:bg-slate-800/60">
                  <td className="px-5 py-4">
                    <Link
                      href={`/tokens/${token.id}`}
                      className="group inline-flex flex-col transition-colors"
                    >
                      <span className="text-sm font-semibold tracking-wide text-slate-100 transition-colors group-hover:text-white">
                        {token.symbol}
                      </span>
                      <span className="text-xs text-slate-400 transition-colors group-hover:text-slate-300">
                        {token.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{token.chain}</td>
                  <td className="px-5 py-4">{compactCurrency.format(token.marketCapHigh)}</td>
                  <td className="px-5 py-4">{compactCurrency.format(token.currentMarketCap)}</td>
                  <td className="px-5 py-4 font-medium text-rose-300">
                    -{token.drawdownPercent.toFixed(2)}%
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-100">
                      {token.resurrectionScore}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        statusStyles[token.status]
                      }`}
                    >
                      {token.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
