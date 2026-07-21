"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "./marketplace";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const headerWrapRef = useRef<HTMLDivElement | null>(null);
  const isAuthRoute = pathname?.startsWith("/auth/");
  const isAccountRoute = pathname?.startsWith("/account");
  const isProductsRoute = pathname?.startsWith("/products");

  useEffect(() => {
    const root = document.documentElement;
    const headerWrap = headerWrapRef.current;

    if (!headerWrap || isAuthRoute) {
      root.style.setProperty("--site-header-height", "0px");
      return;
    }

    const syncHeight = () => {
      root.style.setProperty("--site-header-height", `${headerWrap.offsetHeight}px`);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(headerWrap);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [isAuthRoute, pathname]);

  return (
    <>
      {isAuthRoute ? null : (
        <div ref={headerWrapRef} className={isProductsRoute ? "hidden md:block" : ""}>
          <SiteHeader />
        </div>
      )}
      <main className="relative z-10">{children}</main>
      {isAuthRoute || isAccountRoute ? null : <SiteFooter />}
    </>
  );
}
