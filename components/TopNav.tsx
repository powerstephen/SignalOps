"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Recover" },
  { href: "/generate", label: "Generate" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/calculator", label: "Calculator" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7e9f0] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-950">
            SignalOps
          </Link>

          <nav className="flex flex-wrap items-center gap-8 text-sm">
            {items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    active
                      ? "font-medium text-gray-950"
                      : "text-gray-500 transition hover:text-gray-950"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/connect"
          className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Import
        </Link>
      </div>
    </header>
  );
}
