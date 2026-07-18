import Link from "next/link";
import Image from "next/image";
import { categories, featuredProducts, marketplaceStats, sellSteps, trustCards, } from "@/app/marketplace-data";
import { ProductCard, SectionHeading } from "@/app/components/marketplace";

export default function Home() {

  const heroProduct = featuredProducts[0];
  const secondaryProducts = featuredProducts.slice(1, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-black/10 bg-[#111111] px-6 py-8 text-white sm:px-8 sm:py-10 lg:min-h-160 lg:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col gap-12">
            <div className="flex max-w-2xl flex-col gap-6">
              <p className="text-[0.68rem] uppercase tracking-[0.42em] text-white/55">
                Local resale marketplace
              </p>
              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
                Buy, sell, and move on.
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                A sharper resale experience for people who want listings that feel premium,
                direct chat that feels natural, and product pages that put the item first.
              </p>
            </div>

            <div className="grid">
              <form
                action="/products"
                method="get"
                className="grid gap-3 rounded-3xl border border-white/10 bg-white/6 p-3 backdrop-blur sm:grid-cols-[1fr_auto]"
              >
                <label className="sr-only" htmlFor="search">
                  Search products
                </label>
                <input
                  id="search"
                  name="q"
                  placeholder="Search phones, bikes, laptops..."
                  className="h-14 rounded-[1.1rem] px-4 text-white outline-none transition placeholder:text-white/45 focus:border-white/30"
                />
                <button
                  type="submit"
                  className="h-12 my-auto rounded-xl cursor-pointer bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
                >
                  Browse listings
                </button>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {marketplaceStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/50">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-black/10 bg-white">
            <div className="relative h-115">
              <Image
                src="/headphones.png"
                alt={heroProduct.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/70">
                  Featured listing
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {heroProduct.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/75">
                      {heroProduct.location} · {heroProduct.condition}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold">{heroProduct.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {secondaryProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex items-center gap-4 border-b border-black/10 pb-4 transition hover:-translate-y-0.5"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-[1.3rem] bg-zinc-200">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">
                    {product.category}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-semibold text-zinc-950">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{product.price}</p>
                </div>
                <span className="text-sm font-medium text-zinc-950 transition group-hover:translate-x-1">
                  View
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Categories"
          title="A clean catalog for the things people actually resell."
          description="The browsing experience stays airy and direct, so the product itself carries the attention."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
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
              <p className="mt-2 text-sm leading-6 text-zinc-600">{category.detail}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-zinc-950 transition group-hover:translate-x-1">
                Browse category
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Featured listings"
          title="Items laid out with more breathing room."
          description="The cards stay minimal, but the page itself feels more like a magazine spread than a dashboard."
        />
        <div className="mt-8 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="border-t border-black/10 pt-6">
          <SectionHeading
            eyebrow="How it works"
            title="List, chat, close."
            description="Three simple steps, no visual noise."
          />
          <div className="mt-8 grid gap-5">
            {sellSteps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <div className="text-sm font-semibold text-zinc-950">0{index + 1}</div>
                <div className="max-w-md border-l border-black/10 pl-4">
                  <h3 className="text-base font-semibold text-zinc-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/10 pt-6">
          <SectionHeading
            eyebrow="Why buyers trust it"
            title="Confidence without clutter."
            description="Useful signals stay visible, but the interface still feels open."
          />
          <div className="mt-8 grid gap-5">
            {trustCards.map((card) => (
              <div key={card.title} className="border-b border-black/10 pb-5">
                <h3 className="text-base font-semibold text-zinc-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">For sellers</p>
          <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Give your listing room to breathe and let the details do the selling.
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
            href="/auth/login"
            className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-white"
          >
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
