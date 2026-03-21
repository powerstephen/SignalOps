import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "SignalOps",
  description: "Revenue intelligence workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f6f7fb] text-gray-900 antialiased">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
