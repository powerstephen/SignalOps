"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const metadata = {
  title: "SignalOps",
  description: "Revenue intelligence workspace",
};

const navItems = [
  { href: "/", label: "Recover" },
  { href: "/generate", label: "Generate" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/calculator", label: "Calculator" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-[#f6f7fb] text-gray-900 antialiased">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
            
            {/* LEFT SIDE */}
            <div className="flex items-center gap-10">

              {/* LOGO */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="SignalOps"
                  width={140}
                  height={32}
                  priority
                />
              </Link>

              {/* NAV */}
              <nav className="flex items-center gap-8 text-sm">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

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
                            : "text-gray-500 hover:text-gray-900"
                        }
                      >
                        {item.label}
                      </span>

                      {/* ACTIVE UNDERLINE */}
                      {isActive && (
                        <span className="absolute left-0 right-0 -bottom-[9px] h-[2px] bg-[#0b1f3a]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT SIDE */}
            <Link
              href="/connect"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Import
            </Link>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
