"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard, SectionHeading } from "@/components/marketplace";
import { fetchListings } from "@/services/listings/api";
import type { ListingView } from "@/services/listings/types";

type CategorySummary = {
  label: string;
  slug: string;
  count: number;
};

export default function Home() {
  const [listings, setListings] = useState<ListingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadListings = async () => {
      setLoading(true);

      try {
        const items = await fetchListings();
        if (!active) return;
        setListings(items);
        setError(null);
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load listings");
        setListings([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadListings();

    return () => {
      active = false;
    };
  }, []);

  const heroProduct = listings[0];

  const categories = useMemo<CategorySummary[]>(() => {
    const map = new Map<string, CategorySummary>();

    for (const listing of listings) {
      const current = map.get(listing.categorySlug);
      if (current) {
        current.count += 1;
      } else {
        map.set(listing.categorySlug, {
          label: listing.category,
          slug: listing.categorySlug,
          count: 1,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [listings]);

  const stats = useMemo(
    () => [
      { label: "Active listings", value: String(listings.length) },
      { label: "Categories", value: String(categories.length) },
      { label: "Cities", value: String(new Set(listings.map((listing) => listing.location)).size) },
    ],
    [categories.length, listings],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-black/10 bg-[#111111] px-6 md:px-10 py-8 md:py-12 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="max-w-2xl">
              <p className="text-[0.68rem] uppercase tracking-[0.42em] text-white/55">
                Live marketplace
              </p>
              <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
                See what is actually live right now.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                The homepage is driven by the backend, so the catalog, search, and featured
                listings reflect current inventory instead of stale fixture data.
              </p>
            </div>

            <form
              action="/products"
              method="get"
              className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/6 p-3 backdrop-blur sm:grid-cols-[1fr_auto]"
            >
              <label className="sr-only" htmlFor="search">
                Search listings
              </label>
              <input
                id="search"
                name="q"
                placeholder="Search listings..."
                className="h-14 rounded-[1.1rem] px-4 text-white outline-none transition placeholder:text-white/45 focus:border-white/30"
              />
              <button
                type="submit"
                className="my-auto h-12 cursor-pointer rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Browse listings
              </button>
            </form>            
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[2.4rem] border border-black/10 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4 px-2 pb-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-zinc-500">
                  Featured right now
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  {heroProduct ? heroProduct.title : "Waiting for a live listing"}
                </h2>
              </div>
              {heroProduct ? (
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-700">
                  {heroProduct.condition}
                </span>
              ) : null}
            </div>

            {heroProduct ? (
              <Link href={`/products/${heroProduct.slug}`} className="group block overflow-hidden rounded-4xl">
                <div className="relative aspect-[5/4.7] overflow-hidden bg-zinc-100">
                  {heroProduct.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroProduct.imageUrl}
                      alt={heroProduct.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#ececec_0%,#f8f8f8_35%,#e5e5e5_100%)]" />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/12 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/65">
                      {heroProduct.category}
                    </p>
                    <h3 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                      {heroProduct.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/75">
                      <span>{heroProduct.location}</span>
                      <span>|</span>
                      <span>{heroProduct.posted}</span>
                    </div>
                    <p className="mt-4 text-2xl font-semibold tracking-tight">
                      {heroProduct.price}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-4xl border border-dashed border-zinc-300 px-6 py-20 text-center text-zinc-500">
                Loading live listings...
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Categories"
          title="Live categories from current listings."
          description="These buckets are built from the data the backend returns right now."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="rounded-[1.4rem] border border-dashed border-zinc-300 p-8 text-zinc-500">
              Loading categories...
            </div>
          ) : categories.length ? (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group border-t border-black/10 pt-5 transition hover:-translate-y-1"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
                  {category.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{category.count} listings</p>
                <span className="mt-4 inline-flex text-sm font-medium text-zinc-950 transition group-hover:translate-x-1">
                  Browse category
                </span>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-zinc-300 p-8 text-zinc-500">
              No categories yet.
            </div>
          )}
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Recent"
          title="Newest live listings."
          description="These cards come directly from the backend without a local fixture layer."
        />
        <div className="mt-8 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="rounded-[1.4rem] border border-dashed border-zinc-300 p-8 text-zinc-500">
              Loading listings...
            </div>
          ) : error ? (
            <div className="rounded-[1.4rem] border border-dashed border-red-300 p-8 text-red-700">
              {error}
            </div>
          ) : (
            listings.slice(0, 3).map((product) => <ProductCard key={product.slug} product={product} />)
          )}
        </div>
      </section>

      <section className="mt-24 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">For sellers</p>
          <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Create a live listing and it will show up here.
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sell"
            className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Create listing
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-white"
          >
            Browse all
          </Link>
        </div>
      </section>
    </div>
  );
}
