import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f6f7fb] text-gray-900">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
            
            {/* LEFT */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-semibold">
                SignalOps
              </Link>

              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="text-gray-900 font-medium">
                  Recover
                </Link>
                <Link href="/?mode=generate" className="text-gray-500 hover:text-gray-900">
                  Generate
                </Link>
                <Link href="/opportunities" className="text-gray-500 hover:text-gray-900">
                  Opportunities
                </Link>
                <Link href="/calculator" className="text-gray-500 hover:text-gray-900">
                  Calculator
                </Link>
              </nav>
            </div>

            {/* RIGHT */}
            <Link
              href="/connect"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
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
