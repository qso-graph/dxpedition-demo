import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DXpedition Propagation Analysis — qso-graph",
  description:
    "Interactive propagation analysis for major DXpeditions. RBN + PSKR observations, solar conditions, and band performance.",
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/solar", label: "Solar" },
  { href: "/activity", label: "Activity" },
  { href: "/bands", label: "Bands" },
  { href: "/geography", label: "Geography" },
  { href: "/greyline", label: "Greyline" },
  { href: "/predictions", label: "Predictions" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link
                href="/"
                className="text-lg font-semibold text-slate-100 hover:text-amber-400 transition-colors"
              >
                qso-graph <span className="text-slate-500 font-normal">/ dxpeditions</span>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
            Data from{" "}
            <a
              href="https://reversebeacon.net"
              className="text-slate-400 hover:text-slate-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reverse Beacon Network
            </a>
            {" & "}
            <a
              href="https://pskreporter.info"
              className="text-slate-400 hover:text-slate-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              PSK Reporter
            </a>
            {" | "}
            <a
              href="https://qso-graph.io"
              className="text-slate-400 hover:text-slate-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              qso-graph.io
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
