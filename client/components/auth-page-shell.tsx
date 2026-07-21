"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: AuthPageShellProps) {
  return (
    <div className=" px-10 py-2">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.05),transparent_24%),linear-gradient(180deg,#f7f3ec_0%,#fbfaf8_45%,#f4f4f2_100%)]" />
      <div className="mx-auto flex gap-10 min-h-screen items-center">
        <section className="relative h-fit overflow-hidden rounded-[2.6rem] border border-black/10 bg-[#111111] px-7 py-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:px-10 sm:py-10 lg:p-12 w-[55vw]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col gap-7">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-white/55">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">
                  Buyers
                </p>
                <h3 className="mt-3 text-lg font-semibold">
                  Find great deals
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Browse thousands of verified listings
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">
                  Sellers
                </p>
                <h3 className="mt-3 text-lg font-semibold">
                  Sell in minutes
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Upload products and manage listings
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">
                Why Mandi?
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                  <div>
                    <h4 className="font-medium">Verified accounts</h4>
                    <p className="text-sm text-white/65">
                      Buy and sell with confidence through authenticated users.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                  <div>
                    <h4 className="font-medium">Real-time chat</h4>
                    <p className="text-sm text-white/65">
                      Talk directly with buyers and sellers without sharing personal details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                  <div>
                    <h4 className="font-medium">Simple listing flow</h4>
                    <p className="text-sm text-white/65">
                      Create listings with photos, pricing, and categories in just a few clicks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden flex items-center justify-center h-fit rounded-[2.6rem] border border-black/10 bg-white/95 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,244,0.98))]" />
          <div className="relative z-10">
            {children}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-black/10 pt-5">
              <Link
                href={primaryAction.href}
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                {primaryAction.label}
              </Link>
              <Link
                href={secondaryAction.href}
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 transition hover:border-black hover:text-black"
              >
                {secondaryAction.label}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
