"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "@/app/components/marketplace";
import { useListings } from "@/app/listings-provider";

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { listings } = useListings();
  const slug = params.slug;

  const product = useMemo(() => listings.find((item) => item.slug === slug), [listings, slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return listings
      .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
      .slice(0, 3);
  }, [listings, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-black/10 bg-white p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">Not found</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
            That listing does not exist.
          </h1>
          <p className="mt-4 text-sm leading-6 text-black/70">
            The item may not have loaded yet or the link is outdated.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Browse products
            </button>
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:border-black hover:bg-black/5"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-black/55">
        <Link href="/" className="transition hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-black">
          Products
        </Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </div>

      <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-10">
          <div className="overflow-hidden rounded-[2.4rem] border border-black/10 bg-white">
            <div className="relative h-170">
              <Image
                src={product.image}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-black/10 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-black">
                {product.condition}
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-white/95 p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                      {product.category}
                    </p>
                    <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-black sm:text-6xl">
                      {product.title}
                    </h1>
                    <p className="mt-3 text-sm text-black/70">
                      {product.location} · {product.posted}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-black sm:text-4xl">
                    {product.price}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="border-t border-black/10 pt-5">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              Description
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-black/70">
              {product.longDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="border-t border-black/10 pt-5">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              Key details
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between border-b border-black/10 py-3"
                >
                  <span className="text-sm text-black/55">{spec.label}</span>
                  <span className="text-sm font-medium text-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-black/10 pt-5">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              More listings like this
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">
              Similar items from the same category
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-4xl border border-black/10 bg-black p-6 text-white">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-white/55">
              Product summary
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{product.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {product.condition} · {product.location}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
              >
                Proceed to buy
              </Link>
              <Link
                href="/messages"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to seller
              </Link>
            </div>
          </div>

          <div className="border-t border-black/10 pt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">Seller</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-black">{product.seller.name}</h3>
                <p className="mt-1 text-sm text-black/70">{product.seller.location}</p>
              </div>
              {product.seller.verified ? (
                <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-black">
                  Verified
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-black/70">{product.seller.response}</p>
          </div>

          <div className="border-t border-black/10 pt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              Purchase flow
            </p>
            <div className="mt-5 grid gap-5">
              {[
                "Message the seller and confirm the item is still available.",
                "Negotiate price and agree on a meetup or delivery plan.",
                "Inspect the product, then complete the purchase.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="max-w-md border-b border-black/10 pb-4 text-sm leading-6 text-black/70">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 pt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              Buyer safety
            </p>
            <p className="mt-3 text-sm leading-7 text-black/70">
              Meet in public, inspect the listing in person, and only proceed when the condition
              matches the photos and description.
            </p>
          </div>

          <div className="overflow-hidden rounded-4xl border border-black/10 bg-white">
            <div className="border-b border-black/10 p-6">
              <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                Seller location
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">
                Approximate meetup area
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/70">
                Dummy location preview for now. Confirm the exact meetup point with the seller
                before you travel.
              </p>
            </div>
            <div className="relative h-72 overflow-hidden bg-[#f4f1ea]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.05),transparent_34%)]" />
              <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(17,17,17,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />

              <div className="absolute inset-x-6 top-8 h-px bg-black/8" />
              <div className="absolute inset-x-6 top-20 h-px bg-black/8" />
              <div className="absolute inset-x-6 top-32 h-px bg-black/8" />
              <div className="absolute inset-x-6 top-44 h-px bg-black/8" />
              <div className="absolute inset-x-6 top-56 h-px bg-black/8" />
              <div className="absolute inset-y-6 left-10 w-px bg-black/8" />
              <div className="absolute inset-y-6 left-24 w-px bg-black/8" />
              <div className="absolute inset-y-6 left-40 w-px bg-black/8" />
              <div className="absolute inset-y-6 left-56 w-px bg-black/8" />

              <div className="absolute left-[18%] top-[22%] h-[56%] w-[26%] rounded-full border border-black/10 bg-black/5 blur-[0.3px]" />
              <div className="absolute left-[42%] top-[36%] h-[18%] w-[30%] rotate-[-7deg] rounded-full border border-black/10 bg-white/40" />

              <div className="absolute left-[56%] top-[48%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="relative">
                  <div className="h-9 w-9 rounded-full border-4 border-white bg-black shadow-[0_10px_24px_rgba(17,17,17,0.16)]" />
                  <div className="absolute left-1/2 top-9 h-9 w-px -translate-x-1/2 bg-black/25" />
                </div>
                <div className="mt-9 rounded-full border border-black/10 bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_8px_20px_rgba(17,17,17,0.05)]">
                  {product.location}
                </div>
              </div>

              <div className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-black/55 backdrop-blur">
                Approximate area
              </div>
              <div className="absolute bottom-4 left-4 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-medium text-black/70 backdrop-blur">
                Dummy map preview
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
