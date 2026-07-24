"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, BriefcaseBusiness, CarFront, ChevronLeft, ChevronRight, Ellipsis, House, Laptop, LayoutGrid, Menu, Shirt, Search, Sofa, Trophy, type LucideIcon, Wrench } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { ProductCard } from "@/components/marketplace";
import { Skeleton } from "@/components/skeleton";
import { fetchListings } from "@/services/listings/api";
import type { ListingView } from "@/services/listings/types";

type CategorySummary = {
  label: string;
  slug: string;
  count: number;
  icon: LucideIcon;
};

const FIXED_CATEGORIES: CategorySummary[] = [
  { label: "All", slug: "", count: 0, icon: LayoutGrid },
  { label: "Electronics", slug: "electronics", count: 0, icon: Laptop },
  { label: "Vehicles", slug: "vehicles", count: 0, icon: CarFront },
  { label: "Fashion", slug: "fashion", count: 0, icon: Shirt },
  { label: "Books", slug: "books", count: 0, icon: BookOpen },
  { label: "Furniture", slug: "furniture", count: 0, icon: Sofa },
  { label: "Sports", slug: "sports", count: 0, icon: Trophy },
  { label: "Real Estate", slug: "real_estate", count: 0, icon: House },
  { label: "Services", slug: "services", count: 0, icon: Wrench },
  { label: "Jobs", slug: "jobs", count: 0, icon: BriefcaseBusiness },
  { label: "Others", slug: "others", count: 0, icon: Ellipsis },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const selectedCategory = searchParams.get("category")?.trim().toLowerCase() ?? "";
  const { user, logout } = useAppContext();
  const [listings, setListings] = useState<ListingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const categories = useMemo<CategorySummary[]>(() => {
    const counts = new Map<string, number>();

    for (const listing of listings) {
      counts.set(listing.categorySlug, (counts.get(listing.categorySlug) ?? 0) + 1);
    }

    return FIXED_CATEGORIES.map((category) => ({
      ...category,
      count: category.slug ? counts.get(category.slug) ?? 0 : listings.length,
    }));
  }, [listings]);

  const filteredProducts = useMemo(() => {
    return listings.filter((product) => {
      const matchesQuery =
        !query ||
        [product.title, product.description, product.location, product.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory = !selectedCategory || product.categorySlug === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [listings, query, selectedCategory]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    router.refresh();
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarCollapsed((current) => !current);
      return;
    }

    setMobileSidebarOpen((current) => !current);
  };

  const desktopSidebarWidthClass = sidebarCollapsed ? "md:w-24" : "md:w-60";

  return (
    <div className="mx-auto flex h-[calc(100dvh-1rem)] flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-md md:hidden"
      >
        <Menu className="h-4 w-4" />
        Categories
      </button>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden border border-zinc-200 bg-white shadow-sm">

        <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[auto_1fr]">
          {mobileSidebarOpen ? (
            <button
              type="button"
              aria-label="Close categories"
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 md:hidden"
            />
          ) : null}

          <aside
            className={`fixed inset-y-0 left-0 z-40 flex min-h-0 w-[64vw] max-w-52 flex-none flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50 shadow-xl transition-[transform,width] duration-300 ease-in-out will-change-transform md:static md:z-auto md:h-full md:max-w-none md:translate-x-0 md:shadow-none ${desktopSidebarWidthClass} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div
                className={`overflow-hidden ${mobileSidebarOpen || !sidebarCollapsed ? "block" : "hidden md:hidden"}`}
              >
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-zinc-500">
                  Browse
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-950">Categories</h2>
              </div>

              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-50"
                aria-label={mobileSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {mobileSidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>

            <nav className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-3">
              {categories.map((category) => (
                <CategoryItem
                  key={category.slug}
                  href={category.slug ? `/products?category=${category.slug}` : "/products"}
                  label={category.label}
                  count={category.count}
                  active={category.slug ? selectedCategory === category.slug : !selectedCategory}
                  collapsed={sidebarCollapsed}
                  icon={category.icon}
                />
              ))}
            </nav>

            <div className="mt-auto border-t border-zinc-200 p-3 md:hidden">
              <div className="grid gap-2">
                <Link
                  href="/account"
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  Account
                </Link>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                      setMobileSidebarOpen(false);
                    }}
                    className="rounded-xl border cursor-pointer border-zinc-300 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-700"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </aside>

          <main className="flex min-h-0 flex-col bg-white px-5 py-4">
            <div className="mb-5 flex items-center gap-4 border-b border-zinc-200 pb-4">
              <div className="flex h-12 flex-1 overflow-hidden rounded-xl border border-zinc-300 bg-white">
                <div className="flex items-center px-4 text-zinc-400">
                  <Search className="h-4 w-4" />
                </div>

                <input
                  name="q"
                  defaultValue={searchParams.get("q") ?? ""}
                  placeholder="Search listings..."
                  className="h-full flex-1 bg-transparent pr-4 text-sm outline-none placeholder:text-zinc-400"
                />

                <button className="border-l cursor-pointer border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
                  Search
                </button>
              </div>

              <Link
                href="/sell"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-zinc-300 bg-black px-4 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Sell item
              </Link>
            </div>

            <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto pr-1 pb-4">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProductTileSkeleton key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-xl border border-dashed border-red-300 py-20 text-center">
                  <h3 className="text-xl font-semibold text-zinc-900">Could not load listings</h3>
                  <p className="mt-2 text-zinc-500">{error}</p>
                </div>
              ) : filteredProducts.length ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      editHref={user?.userId === product.ownerId ? `/sell/${product.slug}` : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-300 py-20 text-center">
                  <h3 className="text-xl font-semibold text-zinc-900">No listings found</h3>
                  <p className="mt-2 text-zinc-500">Try another search or category.</p>
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
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-1rem)] flex-col overflow-hidden px-4">
      <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[auto_1fr]">
        <aside className="hidden min-h-0 w-60 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50 md:flex">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="space-y-3 p-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl border border-white bg-white px-4 py-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-white px-5 py-4">
          <div className="mb-5 flex items-center gap-4 border-b border-zinc-200 pb-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductTileSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function ProductTileSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <Skeleton className="aspect-[4.5/3.6] w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-3 w-20 rounded-full" />
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-6 w-2/3 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CategoryItem({
  href,
  label,
  count,
  active,
  collapsed,
  icon: Icon,
}: {
  href: string;
  label: string;
  count?: number;
  active?: boolean;
  collapsed?: boolean;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className={`mb-2 flex items-center gap-3 rounded-xl border px-4 py-2 text-sm font-medium transition ${active
        ? "border-zinc-300 bg-white text-zinc-950"
        : "border-transparent bg-transparent text-zinc-700 hover:border-zinc-200 hover:bg-white"
        } ${collapsed ? "justify-center px-0 md:px-0" : ""}`}
    >
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${active ? "border-zinc-200 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-700"
          }`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>
      {collapsed ? null : (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {typeof count === "number" ? <span className="text-xs text-zinc-400">{count}</span> : null}
        </>
      )}
    </Link>
  );
}
