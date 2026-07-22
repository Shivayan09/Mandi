"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Grid2x2, ListChecks, Settings2, UserCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/skeleton";

const NAV_ITEMS = [
  {
    href: "/account",
    label: "Account overview",
    description: "Profile summary and shortcuts",
    icon: UserCircle2,
  },
  {
    href: "/account/my-listings",
    label: "My listings",
    description: "Listings you have published",
    icon: ListChecks,
  },
  {
    href: "/account/personal-info",
    label: "Personal info",
    description: "Name, email, and phone details",
    icon: Grid2x2,
  },
  {
    href: "/account/settings",
    label: "Platform settings",
    description: "Preferences and account controls",
    icon: Settings2,
  },
] as const;

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAppContext();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  const activeHref = useMemo(() => {
    if (!pathname) return "/account";
    const match = [...NAV_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    return match?.href ?? "/account";
  }, [pathname]);

  if (loading) {
    return (
      <div className="h-[calc(100dvh-var(--site-header-height,0px))] overflow-hidden">
        <div className="grid h-full min-h-0 gap-0 lg:grid-cols-[270px_1fr]">
          <aside className="flex h-full flex-col overflow-hidden border-r border-black/10 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-black/10 bg-zinc-100 p-5">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="mt-2 h-4 w-48 rounded-full" />
            </div>

            <div className="mt-4 flex-1 px-4 pb-4 pt-2">
              <div className="grid gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl border border-white bg-white px-4 py-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-36 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="scrollbar-hidden min-h-0 min-w-0 overflow-y-auto px-5 py-3">
            <div className="space-y-6">
              <Skeleton className="h-10 w-56 rounded-full" />
              <Skeleton className="h-40 w-full rounded-[2rem]" />
              <Skeleton className="h-96 w-full rounded-[2rem]" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <div className="h-[calc(100dvh-var(--site-header-height,0px))] overflow-hidden">
        <div className="grid h-full min-h-0 gap-0 lg:grid-cols-[270px_1fr]">
          <aside className="flex h-full flex-col overflow-hidden border-r border-black/10 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-black/10 bg-zinc-100 p-5">
              <div className="flex items-center gap-4">
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold tracking-tight text-black">
                    {user.name}
                  </h1>
                  <p className="truncate text-sm text-black/60">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="scrollbar-hidden mt-4 flex-1 overflow-y-auto px-4 pb-4 pt-2">
              <div className="grid gap-2">
                {NAV_ITEMS.map((item) => {
                  const active = activeHref === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                        active
                          ? "border-black/20 bg-white text-black"
                          : " border-white bg-white text-black/75 hover:border-black/20 hover:bg-black/5"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                          active ? "border-white/10 bg-black text-white" : "border-black/10 bg-zinc-50 text-black"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-5">{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <main className="scrollbar-hidden min-h-0 min-w-0 overflow-y-auto px-5 py-3">{children}</main>
        </div>
      </div>

      <footer className="w-full border-t border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="grid w-full gap-4 px-6 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:px-8">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-black/55">
              Built for resale
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-black">
              Buy locally, sell faster, and keep the conversation simple.
            </h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <FooterLink href="/products" label="Browse products" />
            <FooterLink href="/sell" label="Sell an item" />
            <FooterLink href="/messages" label="Open messages" />
            <FooterLink href="/account" label="Account overview" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-[1.2rem] border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/70 transition hover:border-black hover:text-black"
    >
      {label}
    </Link>
  );
}
