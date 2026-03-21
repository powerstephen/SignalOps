"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Recover" },
  { href: "/generate", label: "Generate" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/calculator", label: "Calculator" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SignalOps"
              width={180}
              height={40}
              priority
            />
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative pb-2"
                >
                  <span
                    className={
                      isActive
                        ? "font-medium text-gray-950"
                        : "text-gray-500 transition hover:text-gray-950"
                    }
                  >
                    {item.label}
                  </span>

                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-[#0b1f3a]" />
                  ) : null}
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
    </div>
  );
}
