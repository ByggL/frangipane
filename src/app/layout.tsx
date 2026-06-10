import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import UserMenu from "./components/UserMenu";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wrestler TCG",
  description: "Collect and manage your legendary wrestling roster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <Providers>
          <header className="fixed top-0 left-0 right-0 z-100 px-8 py-6">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-3">
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black rounded-lg group-hover:rotate-12 transition-transform">
                  W
                </div>
                <span className="text-white font-serif font-black uppercase tracking-tighter text-xl">
                  Wrestler TCG
                </span>
              </Link>

              <div className="flex items-center gap-8 bg-white/3 backdrop-blur-xl border border-white/5 px-6 py-2.5 rounded-full shadow-2xl">
                <Link
                  href="/"
                  className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]"
                >
                  Home
                </Link>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <Link
                  href="/roster"
                  className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]"
                >
                  The Vault
                </Link>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <Link
                  href="/pull"
                  className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]"
                >
                  Open Pack
                </Link>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <Link
                  href="/collection"
                  className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]"
                >
                  My Collection
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <UserMenu />
              </div>
            </nav>
          </header>
          <div className="pt-20 flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
