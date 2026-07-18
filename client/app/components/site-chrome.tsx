"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "./marketplace";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth/");

  return (
    <>
      {isAuthRoute ? null : <SiteHeader />}
      <main className="relative z-10">{children}</main>
      {isAuthRoute ? null : <SiteFooter />}
    </>
  );
}
