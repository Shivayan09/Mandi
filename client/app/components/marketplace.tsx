"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { Product } from "@/app/marketplace-data";
import { useAppContext } from "@/context/AppContext";

export function SiteHeader() {
  const router = useRouter();
  const { user, loading, logout } = useAppContext();
  const accountNav = loading ? (
    <span className="rounded-full px-4 py-2 text-black/35">Account</span>
  ) : user ? (
    <NavLink href="/account">Account</NavLink>
  ) : null;

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="relative z-10 border-b border-black/10 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black bg-black text-sm font-semibold tracking-[0.28em] text-white">
            MD
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-black/55">
              Marketplace
            </p>
            <Link href="/" className="text-lg font-semibold tracking-tight text-black">
              Mandi
            </Link>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-black/10 bg-white p-1 text-sm font-medium text-black/70 md:flex">
          <NavLink href="/products">Browse</NavLink>
          <NavLink href="/sell">Sell</NavLink>
          <NavLink href="/messages">Messages</NavLink>
          {accountNav}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="text-[0.65rem] uppercase tracking-[0.28em] text-black/45">
                Signed in
              </span>
              <span className="text-sm font-semibold text-black">{user.name}</span>
            </div>
          ) : (
            <Link
              href="/products"
              className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition hover:border-black hover:text-black sm:inline-flex"
            >
              Explore listings
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition hover:border-black hover:text-black"
            >
              Logout
            </button>
          ) : null}
          <Link
            href="/sell"
            className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            List item
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-black/10 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-black/55">
            Built for resale
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">
            Buy locally, sell faster, and keep the conversation simple.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/70">
            Mandi is designed as a clean resale experience with focused listings,
            clear product pages, and direct buyer-seller chat.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FooterLink href="/products" label="Browse products" />
          <FooterLink href="/sell" label="Sell an item" />
          <FooterLink href="/messages" label="Open messages" />
          <FooterLink href="/auth/login" label="Account access" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-[1.4rem] border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/70 transition hover:border-black hover:text-black"
    >
      {label}
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 transition hover:bg-black/5 hover:text-black"
    >
      {children}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="text-[0.68rem] uppercase tracking-[0.34em] text-black/55">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-6 text-black/70 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="block overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-colors hover:border-zinc-400"
    >
      {/* Image */}
      <div className="relative aspect-[4/3.6] bg-zinc-50">
        <Image
          src={product.image}
          alt={product.title}
          fill
          unoptimized
          className="object-contain p-6"
        />

        <span className="absolute left-4 top-4 rounded-full border border-zinc-300 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-700">
          {product.condition}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Category */}
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
          {product.category}
        </p>

        {/* Title + Price */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-950">
            {product.title}
          </h3>

          <span className="shrink-0 text-lg font-semibold text-zinc-950">
            {product.price}
          </span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2">
          {product.specs.slice(0, 3).map((spec) => (
            <span
              key={spec.label}
              className="text-xs text-zinc-500"
            >
              {spec.value}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-sm text-zinc-500">
          <span>{product.location}</span>

          <span>{product.posted}</span>
        </div>
      </div>
    </Link>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white px-4 py-4">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/55">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-black">{value}</p>
      {detail ? <p className="mt-1 text-sm text-black/70">{detail}</p> : null}
    </div>
  );
}

export function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-4xl border border-black/10 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function InfoPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/10 bg-white px-4 py-3">
      <p className="text-[0.62rem] uppercase tracking-[0.3em] text-black/55">{label}</p>
      <p className="mt-1 text-sm font-medium text-black">{value}</p>
    </div>
  );
}
