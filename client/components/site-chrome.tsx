"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "./marketplace";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth/");
  const isProductsRoute = pathname?.startsWith("/products");

  return (
    <>
      {isAuthRoute ? null : (
        <div className={isProductsRoute ? "hidden md:block" : ""}>
          <SiteHeader />
        </div>
      )}
      <main className="relative z-10">{children}</main>
      {isAuthRoute ? null : <SiteFooter />}
    </>
  );
}
