import Link from "next/link";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Vulture Protocol",
  description: "Solana resurrection token scanner MVP",
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "#" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-sm font-semibold uppercase tracking-wide text-slate-100">
                Vulture Protocol
              </Link>

              <div className="flex items-center gap-5 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="border-t border-slate-800 py-6">
            <div className="mx-auto w-full max-w-6xl px-6 text-xs text-slate-500">
              Vulture Protocol © 2026
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
