import type { ReactNode } from "react";
import { SidebarNav } from "@/app/dashboard/_components/sidebar-nav";
import { getTokenCountsByStatus } from "@/lib/tokens";

type DashboardLayoutProps = {
  children: ReactNode;
};

const navLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Tokens", href: "/tokens/1" },
  { label: "Watchlist", href: "#" },
  { label: "Solana Scanner Rules", href: "#" },
] as const;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { total, dead, zombie, resurrection } = getTokenCountsByStatus();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:sticky lg:top-24 lg:w-72 lg:self-start">
          <div className="mb-4 border-b border-slate-800 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solana Scanner</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Workspace</h2>
          </div>

          <SidebarNav links={navLinks} />

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Solana Solana Summary
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Tracked</dt>
                <dd className="font-semibold text-slate-100">{total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Dead</dt>
                <dd className="font-semibold text-rose-300">{dead}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Zombie</dt>
                <dd className="font-semibold text-amber-300">{zombie}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Resurrection</dt>
                <dd className="font-semibold text-emerald-300">{resurrection}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
