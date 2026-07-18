import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ListingsProvider } from "./listings-provider";
import "./globals.css";
import { SiteChrome } from "./components/site-chrome";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mandi",
  description: "A modern resale marketplace for buying, selling, and chatting locally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f5f4f1] text-zinc-950">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_38%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.12),transparent_30%),linear-gradient(180deg,#f7f6f2_0%,#efede8_45%,#f8f7f4_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10" />
          <AppProvider>
            <ListingsProvider>
              <SiteChrome>{children}</SiteChrome>
            </ListingsProvider>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
