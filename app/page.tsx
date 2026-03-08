import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
      <span className="mb-4 inline-block rounded-full border border-brand-700/60 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-50">
        Initial scaffold
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Vulture Protocol</h1>
      <p className="mt-4 max-w-2xl text-slate-300">
        A modular web platform scaffold for spotting tokens that may have strong revival
        potential.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex w-fit rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Open dashboard
      </Link>
    </main>
  );
}
