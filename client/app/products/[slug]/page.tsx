"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { deleteListing, fetchListings, updateListing } from "@/services/listings/api";
import { createConversation } from "@/services/chat/api";
import type { ListingView } from "@/services/listings/types";

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAppContext();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [listings, setListings] = useState<ListingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isOpeningChat, setIsOpeningChat] = useState(false);

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
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load listing");
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

  const product = useMemo(() => listings.find((item) => item.slug === slug), [listings, slug]);
  const isOwner = Boolean(user && product && user.userId === product.ownerId);
  const mapQuery = product?.location?.trim() ?? "";
  const mapUrl = mapQuery && mapQuery.toLowerCase() !== "unknown" && mapQuery.toLowerCase() !== "online" ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed` : null;

  const handleMarkSold = async () => {
    if (!product || !window.confirm("Mark this listing as sold?")) return;
    try {
      const formData = new FormData();
      formData.append("status", "sold");
      await updateListing(product.slug, formData);
      window.location.reload();
    } catch (actionErr) {
      setActionError(actionErr instanceof Error ? actionErr.message : "Could not update listing");
    }
  };

  const handleDelete = async () => {
    if (!product || !window.confirm("Delete this listing? This cannot be undone.")) return;

    try {
      await deleteListing(product.slug);
      router.push("/products");
    } catch (actionErr) {
      setActionError(actionErr instanceof Error ? actionErr.message : "Could not delete listing");
    }
  };

  const handleTalkToSeller = async () => {
    if (!product) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.userId === product.ownerId) {
      router.push("/messages");
      return;
    }

    setIsOpeningChat(true);
    setActionError(null);

    try {
      const conversation = await createConversation(product.ownerId);
      const conversationId = conversation?._id;
      router.push(conversationId ? `/messages?conversationId=${conversationId}` : "/messages");
    } catch (talkError) {
      setActionError(talkError instanceof Error ? talkError.message : "Could not open chat");
    } finally {
      setIsOpeningChat(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-black/10 bg-white p-8 text-zinc-500">
          Loading listing...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-black/10 bg-white p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">Error</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
            Could not load this listing.
          </h1>
          <p className="mt-4 text-sm leading-6 text-black/70">{error}</p>
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

  if (!product) {
    return (
      <div className="mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-black/10 bg-white p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">Not found</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
            That listing does not exist.
          </h1>
          <p className="mt-4 text-sm leading-6 text-black/70">
            The item may have been removed or the link is outdated.
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
    <div className="mx-auto px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-2 text-sm text-black/55">
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

      <section className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-10">
          <div className="overflow-hidden rounded-[2.4rem] border border-black/10 bg-white">
            <div className="relative h-120 bg-zinc-50">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
              ) : null}
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
                    <h1 className="mt-3 max-w-2xl text-5xl font-semibold tracking-tight text-black">
                      {product.title}
                    </h1>
                    <p className="mt-3 text-sm text-black/70">
                      {product.location} · {product.posted}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-black sm:text-4xl">{product.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-4xl border border-black/10 bg-white">
            <div className="border-b border-black/10 p-6">
              <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                Seller location
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">
                {mapQuery || "Location not available"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/70">
                This map is centered on the seller-provided location from the listing record.
              </p>
            </div>

            {mapUrl ? (
              <div className="relative h-80 bg-zinc-100">
                <iframe
                  title={`Map for ${product.title}`}
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="p-6 text-sm text-zinc-500">
                No usable location was provided for this listing.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {isOwner ? (
            <>
              <div className="overflow-hidden rounded-4xl border border-black/10 bg-white">
                <div className="border-b border-black/10 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                    Owner dashboard
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-semibold tracking-tight text-black">
                        Your listing
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        Edit the listing, mark it sold, or remove it from the marketplace.
                      </p>
                    </div>
                    <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                      {product.status}
                    </span>
                  </div>
                  {actionError ? (
                    <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {actionError}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  <InfoTile label="Views" value={`${product.views}`} />
                  <InfoTile label="Favorites" value={`${product.favorites}`} />
                  <InfoTile label="Negotiable" value={product.negotiable ? "Yes" : "No"} />
                  <InfoTile label="Location" value={product.location} />
                </div>

                <div className="border-t border-black/10 p-6">
                  <div className="grid gap-3">
                    <Link
                      href={`/sell/${product.slug}`}
                      className="rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-black/80"
                    >
                      Edit listing
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleMarkSold()}
                      className="rounded-full border border-black/20 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
                    >
                      Mark as sold
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Delete listing
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-4xl border border-black/10 bg-white p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">Buy now</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{product.title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/75">
                  {product.condition} · {product.location}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/auth/login"
                    className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
                  >
                    Proceed to buy
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleTalkToSeller()}
                    disabled={isOpeningChat}
                    className="rounded-full border border-black/20 px-5 py-3 text-sm font-semibold transition hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isOpeningChat ? "Opening chat..." : "Talk to seller"}
                  </button>
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

              <div className="my-10">
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                  Buyer caution
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">
                  Things to check before you meet
                </h3>
                <div className="mt-6 space-y-5 text-sm leading-7 text-black/70">
                  <p>• Verify the seller name, location, and item condition in chat before you travel.</p>
                  <p>• Ask for one extra photo or a short video if any detail looks unclear or too good to be true.</p>
                  <p>• Meet in a public place with good foot traffic, and inspect the item before you hand over payment.</p>
                </div>
              </div>
            </>
          )}

          <div className="my-5 border border-black/10 rounded-4xl p-5">
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
          </div>

          <div className="rounded-4xl border border-black/10 p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
              Key details
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between border-b border-black/10 py-3 mr-5"
                >
                  <span className="text-sm text-black/55">{spec.label}</span>
                  <span className="text-sm font-medium text-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/2 px-4 py-3">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-black/45">{label}</p>
      <p className="mt-2 text-sm font-semibold text-black">{value}</p>
    </div>
  );
}
