import Link from "next/link";

const featureCards = [
  {
    title: "Graveyard Scanner",
    description:
      "Track dead and forgotten tokens that once reached significant market caps.",
  },
  {
    title: "Resurrection Score",
    description:
      "Rank revival potential using drawdown, liquidity, and momentum signals.",
  },
  {
    title: "Signal Monitoring",
    description:
      "Watch for volume spikes, market compression, and early recovery patterns.",
  },
] as const;

const scannerStats = [
  { label: "Tokens Scanned", value: "10,000+" },
  { label: "Resurrection Candidates", value: "120" },
  { label: "Active Chains", value: "5" },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-50">Vulture Protocol</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Scan the Solana graveyard for resurrection tokens
        </h1>
        <p className="mt-5 max-w-3xl text-slate-300">
          Vulture Protocol tracks tokens that previously reached high market caps, collapsed
          more than 95%, and may now be showing early revival signals across the Solana
          ecosystem.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center justify-center rounded-md bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Open Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white"
          >
            View Scanner
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {featureCards.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10"
          >
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {scannerStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Start scanning Solana's graveyard</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Open the dashboard to explore high-drawdown tokens and identify potential resurrection
          candidates.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex w-fit items-center justify-center rounded-md bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
