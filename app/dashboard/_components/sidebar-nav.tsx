"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardNavLink = {
  label: string;
  href: string;
};

type SidebarNavProps = {
  links: readonly DashboardNavLink[];
};

export function SidebarNav({ links }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-800 text-slate-100"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
