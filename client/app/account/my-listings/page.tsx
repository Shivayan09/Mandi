"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard, SectionHeading, Surface } from "@/components/marketplace";
import { Skeleton } from "@/components/skeleton";
import { useAppContext } from "@/context/AppContext";
import { fetchMyListings } from "@/services/listings/api";
import type { ListingView } from "@/services/listings/types";

export default function MyListingsPage() {
  const router = useRouter();
  const { user } = useAppContext();
  const [listings, setListings] = useState<ListingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadListings = async () => {
      setLoading(true);
      try {
        const items = await fetchMyListings();
        if (!active) return;
        setListings(items);
        setError(null);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load listings");
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

  const myListings = useMemo(() => {
    if (!user) return [];
    return listings.filter((listing) => listing.ownerId === user.userId);
  }, [listings, user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Listings"
          title="My listings"
          description="Everything you have published to the marketplace lives here."
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/sell"
            className="inline-flex h-12 items-center justify-center rounded-[1.2rem] bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Create new listing
          </Link>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex h-12 items-center justify-center rounded-[1.2rem] border border-black/10 bg-white px-5 text-sm font-semibold text-black/75 transition hover:border-black hover:text-black"
          >
            Refresh
          </button>
        </div>
      </Surface>

      {loading ? (
        <Surface className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4 rounded-3xl border border-black/10 bg-white p-4">
                <Skeleton className="aspect-[4.5/3.6] w-full rounded-3xl" />
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </Surface>
      ) : error ? (
        <Surface className="p-6">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </Surface>
      ) : myListings.length ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {myListings.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              editHref={`/sell/${product.slug}`}
            />
          ))}
        </div>
      ) : (
        <Surface className="p-8">
          <p className="text-sm font-medium text-black/55">No listings yet</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">
            You have not published anything yet.
          </h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Start with one listing and it will appear here for quick editing and tracking.
          </p>
          <div className="mt-6">
            <Link
              href="/sell"
              className="inline-flex h-12 items-center justify-center rounded-[1.2rem] bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Sell an item
            </Link>
          </div>
        </Surface>
      )}
    </div>
  );
}
