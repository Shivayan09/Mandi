import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SiteChrome } from "@/components/site-chrome";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f5f4f1] text-zinc-950">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-zinc-100" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10" />
          <AppProvider>
            <SiteChrome>{children}</SiteChrome>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
