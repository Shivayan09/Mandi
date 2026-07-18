"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sellChecklist } from "@/app/marketplace-data";
import { SectionHeading, Surface } from "@/app/components/marketplace";
import { useListings } from "@/app/listings-provider";

type ListingInput = {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  condition: "new" | "like_new" | "excellent" | "good" | "fair" | "poor";
  price: number;
  negotiable?: boolean;
  images: File[];
  location: {
    city: string;
    state: string;
    country?: string;
  };
  tags?: string[];
  expiresAt?: string;
};

export default function SellPage() {
  const router = useRouter();
  const { addListing } = useListings();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishListing = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const [city, state] = location
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      const payload: ListingInput = {
        title,
        description,
        category,
        brand: brand.trim() || undefined,
        condition: (condition || "good") as ListingInput["condition"],
        price: Number.parseFloat(price.replace(/[^0-9.]/g, "")),
        images,
        location: {
          city: city || location.trim(),
          state: state || "Unknown",
          country: "India",
        },
      };

      const listing = await addListing(payload);
      router.push(`/products/${listing.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <Surface className="p-6 sm:p-8 lg:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
            List an item
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
            Build a clear listing in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
            Keep the form simple, upload strong photos later, and describe the product with
            enough detail to help buyers decide faster.
          </p>

          <div className="mt-8 rounded-[1.6rem] border border-dashed border-black/15 bg-zinc-50 p-6">
            <div className="grid place-items-center gap-2 rounded-[1.4rem] border border-black/10 bg-white px-6 py-10 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
                Product media
              </p>
              <p className="max-w-sm text-sm leading-6 text-zinc-600">
                Add the image upload and backend calls later. This client is already shaped to
                receive a real create-listing API.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                type="text"
                placeholder="Product title"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="text"
                placeholder="Price"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                type="text"
                placeholder="Category"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
              <input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                type="text"
                placeholder="Brand"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                placeholder="Location"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files) {
                    setImages(Array.from(event.target.files));
                  }
                }}
                className="block w-full rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 py-4 text-sm"
              />

              {images.length > 0 && (
                <p className="text-sm text-zinc-500">
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <select
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition focus:border-black/30 focus:bg-white"
            >
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="like_new">Like new</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              placeholder="Describe the item, usage, accessories, and any defects"
              className="rounded-[1.4rem] border border-black/10 bg-zinc-50 px-4 py-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={publishListing}
                disabled={isSubmitting}
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                {isSubmitting ? "Publishing..." : "Publish listing"}
              </button>
              <Link
                href="/products"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-black/5"
              >
                Preview marketplace
              </Link>
            </div>
          </div>
        </Surface>

        <div className="grid gap-6">
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Selling checklist"
              title="A good listing answers the buyer before they ask."
            />
            <div className="mt-6 grid gap-3">
              {sellChecklist.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.3rem] border border-black/10 bg-zinc-50 px-4 py-4 text-sm text-zinc-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
              Pricing helper
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              Price realistically and leave room for offers.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Clear pricing helps your listing stand out and drives quicker replies from
              serious buyers.
            </p>
            <div className="mt-6 rounded-[1.4rem] border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold text-zinc-950">Suggested example</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                List at a fair price, mention optional accessories, and state whether you are
                open to negotiation or only fixed-price inquiries.
              </p>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
