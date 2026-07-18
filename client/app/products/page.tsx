"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { categories, getCategoryLabel } from "@/app/marketplace-data";
import { ProductCard } from "@/app/components/marketplace";
import { useListings } from "@/app/listings-provider";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const selectedCategory =
    searchParams.get("category")?.trim().toLowerCase() ?? "";

  const { listings } = useListings();

  const filteredProducts = useMemo(() => {
    return listings.filter((product) => {
      const matchesQuery =
        !query ||
        [
          product.title,
          product.description,
          product.location,
          product.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        !selectedCategory || product.categorySlug === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [listings, query, selectedCategory]);

  return (
    <div className="">
      <div className="overflow-hidden border border-zinc-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[230px_1fr]">
          <aside className="border-b border-zinc-200 bg-zinc-50 lg:border-b-0 lg:border-r">
            <div className="border-b border-zinc-200 p-6">
              <h2 className="text-xl font-bold text-zinc-900">Categories</h2>
            </div>

            <nav className="p-4">
              <CategoryItem
                href="/products"
                label="All"
                active={!selectedCategory}
              />

              {categories.map((category) => (
                <CategoryItem
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  label={category.label}
                  active={selectedCategory === category.slug}
                />
              ))}
            </nav>
          </aside>

          {/* ================= Main Content ================= */}
          <main>
            {/* Top Header */}
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">
                    Products
                  </h1>

                  {(selectedCategory || query) && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {selectedCategory
                        ? getCategoryLabel(selectedCategory)
                        : "All Categories"}

                      {query && ` • "${query}"`}
                    </p>
                  )}
                </div>

                <div className="text-sm font-medium text-zinc-500">
                  <span className="font-bold text-zinc-900">
                    {filteredProducts.length}
                  </span>{" "}
                  Results
                </div>
              </div>
            </div>

            <div className="px-6 py-3">
              <form action="/products" method="get">
                {selectedCategory && (
                  <input
                    type="hidden"
                    name="category"
                    value={selectedCategory}
                  />
                )}

                <div className="flex overflow-hidden rounded-xl border border-zinc-300 bg-white">
                  <input
                    name="q"
                    defaultValue={searchParams.get("q") ?? ""}
                    placeholder="Search products..."
                    className="h-12 flex-1 px-4 outline-none"
                  />

                  <button className="border-l border-zinc-300 bg-black px-6 text-white transition hover:bg-zinc-800">
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Products */}
            <div className="p-6">
              {filteredProducts.length ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-300 py-20 text-center">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    No listings found
                  </h3>

                  <p className="mt-2 text-zinc-500">
                    Try another search or category.
                  </p>

                  <Link
                    href="/products"
                    className="mt-6 inline-flex rounded-lg bg-black px-6 py-3 text-white hover:bg-zinc-800"
                  >
                    Browse All
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-black text-white"
          : "text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      <span className="mr-3 text-base">•</span>
      {label}
    </Link>
  );
}