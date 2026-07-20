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
    <div className="relative isolate overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.05),transparent_24%),linear-gradient(180deg,#f7f3ec_0%,#fbfaf8_45%,#f4f4f2_100%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <section className="relative overflow-hidden rounded-[2.6rem] border border-black/10 bg-[#111111] px-7 py-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:px-10 sm:py-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="max-w-xl">
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-white/55">
                {eyebrow}
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                {description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                  Fast access
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Jump straight into buying, selling, or chat.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                  Direct flow
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  No extra steps between sign in and the marketplace.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                  Clean handoff
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Keep the screen focused on the form and the action.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.6rem] border border-black/10 bg-white/95 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
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
