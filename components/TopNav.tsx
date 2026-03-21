"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Recover" },
  { href: "/generate", label: "Generate" }, // FIXED
  { href: "/opportunities", label: "Opportunities" },
  { href: "/calculator", label: "Calculator" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7e9f0] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-semibold text-gray-900">
            Revenue Agent
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
            {items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    isActive
                      ? "font-medium text-gray-900"
                      : "hover:text-gray-900"
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
          className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Import
        </Link>
      </div>
    </header>
  );
}
