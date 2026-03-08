import { TokenTable } from "@/components/token-table";
import { tokenRows } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resurrection Dashboard</h1>
        <p className="mt-2 text-slate-300">
          Placeholder analytics table for high-drawdown tokens with recovery potential.
        </p>
      </div>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Tracked Tokens</p>
            <p className="mt-1 text-2xl font-semibold">{tokenRows.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Avg. Drawdown</p>
            <p className="mt-1 text-2xl font-semibold">
              {(
                tokenRows.reduce((sum, row) => sum + row.drawdownPercent, 0) / tokenRows.length
              ).toFixed(2)}
              %
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Top Score</p>
            <p className="mt-1 text-2xl font-semibold">
              {Math.max(...tokenRows.map((row) => row.resurrectionScore))}
            </p>
          </div>
        </div>

        <TokenTable rows={tokenRows} />
      </section>
    </main>
  );
}
