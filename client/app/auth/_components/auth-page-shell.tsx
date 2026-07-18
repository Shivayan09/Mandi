"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Surface } from "@/app/components/marketplace";

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
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-lg items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="mb-6">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/70 sm:text-base">
            {description}
          </p>
        </div>

        <Surface className="relative overflow-hidden p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.92),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,244,0.98))]" />
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
        </Surface>
      </div>
    </div>
  );
}
