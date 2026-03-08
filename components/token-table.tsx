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
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Token</th>
            <th className="px-4 py-3 font-semibold">Chain</th>
            <th className="px-4 py-3 font-semibold">Peak MCap</th>
            <th className="px-4 py-3 font-semibold">Current MCap</th>
            <th className="px-4 py-3 font-semibold">Drawdown</th>
            <th className="px-4 py-3 font-semibold">Score</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-100">
          {rows.map((token) => (
            <tr key={token.id} className="hover:bg-slate-800/50">
              <td className="px-4 py-3">
                <div className="font-medium">{token.symbol}</div>
                <div className="text-xs text-slate-400">{token.name}</div>
              </td>
              <td className="px-4 py-3 text-slate-300">{token.chain}</td>
              <td className="px-4 py-3">{compactCurrency.format(token.marketCapHigh)}</td>
              <td className="px-4 py-3">{compactCurrency.format(token.currentMarketCap)}</td>
              <td className="px-4 py-3 text-rose-300">-{token.drawdownPercent.toFixed(2)}%</td>
              <td className="px-4 py-3">{token.resurrectionScore}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusStyles[token.status]
                  }`}
                >
                  {token.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
