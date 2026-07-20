"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Surface } from "@/components/marketplace";
import { deleteListing, fetchListingRecord, updateListing } from "@/services/listings/api";
import type { BackendListing } from "@/services/listings/types";

const CATEGORIES = [
  "electronics",
  "vehicles",
  "fashion",
  "books",
  "furniture",
  "sports",
  "real_estate",
  "services",
  "jobs",
  "others",
];

export default function EditListingPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const listingId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [listing, setListing] = useState<BackendListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [negotiable, setNegotiable] = useState("true");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    let active = true;

    const loadListing = async () => {
      setLoading(true);

      try {
        const item = await fetchListingRecord(listingId);
        if (!active) return;
        setListing(item);
        if (item) {
          setTitle(item.title ?? "");
          setPrice(item.price?.toString() ?? "");
          setCategory(item.category ?? "");
          setCondition(item.condition ?? "");
          setBrand(item.brand ?? "");
          setSubCategory(item.subCategory ?? "");
          setLocation([item.location?.city, item.location?.state].filter(Boolean).join(", "));
          setDescription(item.description ?? "");
          setStatus(item.status ?? "active");
          setNegotiable(item.negotiable === false ? "false" : "true");
        }
        setError(null);
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load listing");
        setListing(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      active = false;
    };
  }, [listingId]);

  const currentImageUrl = imagePreview || listing?.images?.[0]?.url || null;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!listing) return;

    setIsSaving(true);
    setFormError(null);

    try {
      const normalizedTitle = title.trim();
      const normalizedDescription = description.trim();
      const normalizedCategory = category.trim();
      const normalizedLocation = location.trim();
      const normalizedBrand = brand.trim();
      const normalizedSubCategory = subCategory.trim();
      const parsedPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""));

      if (!normalizedTitle) throw new Error("Add a product title.");
      if (!normalizedDescription) throw new Error("Add a description.");
      if (!normalizedCategory) throw new Error("Add a category.");
      if (!condition) throw new Error("Choose a condition.");
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) throw new Error("Enter a valid price.");
      if (!normalizedLocation) throw new Error("Add a location.");

      const [cityPart, statePart] = normalizedLocation
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", normalizedTitle);
      formData.append("description", normalizedDescription);
      formData.append("category", normalizedCategory);
      formData.append("condition", condition);
      formData.append("price", parsedPrice.toString());
      formData.append("status", status);
      formData.append("negotiable", negotiable);

      if (normalizedBrand) {
        formData.append("brand", normalizedBrand);
      }

      if (normalizedSubCategory) {
        formData.append("subCategory", normalizedSubCategory);
      }

      formData.append(
        "location",
        JSON.stringify({
          city: cityPart ?? normalizedLocation,
          state: statePart ?? listing.location?.state ?? "Unknown",
          country: listing.location?.country ?? "India",
        }),
      );

      if (imageFile) {
        formData.append("images", imageFile);
      }

      await updateListing(listingId, formData);
      router.push(`/products/${listingId}`);
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Could not update listing");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!listing || !window.confirm("Delete this listing? This cannot be undone.")) return;

    setIsDeleting(true);
    setFormError(null);

    try {
      await deleteListing(listingId);
      router.push("/products");
    } catch (deleteError) {
      setFormError(deleteError instanceof Error ? deleteError.message : "Could not delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-black/10 bg-white p-8 text-zinc-500">
          Loading listing...
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <Surface className="p-8 sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">Edit listing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
            Could not load this listing.
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{error ?? "Listing not found."}</p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Back to products
          </Link>
        </Surface>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-4xl border border-black/10 bg-white">
            <div className="relative aspect-[4.5/3.4] bg-zinc-50">
              {currentImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentImageUrl} alt={listing.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  No image selected
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:bg-black hover:text-white"
                aria-label="Change listing image"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-white/90 px-5 py-4">
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
                  Listing image
                </p>
                <p className="mt-1 text-sm text-zinc-700">
                  Click the pencil to replace the main photo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-black/10 bg-white p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
              Editing tips
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              Keep the changes simple.
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
              <p>• Use City, State in location so the map stays useful.</p>
              <p>• If the item is sold, switch status to Sold instead of deleting it.</p>
              <p>• You can replace the main photo from the card above.</p>
            </div>
          </div>

          <div className="rounded-4xl border border-black/10 bg-white p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
              Current listing
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              {listing.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {listing.category} · {listing.condition} · {listing.status}
            </p>
          </div>
        </aside>

        <Surface className="p-6 sm:p-8 lg:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">Edit listing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
            Update your item.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
            Change the details buyers see. If you choose a new photo, it will replace the current
            main image for this listing.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSave}>
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
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition focus:border-black/30 focus:bg-white"
              >
                <option value="" disabled>
                  Select category
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </option>
                ))}
              </select>

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
                placeholder="City, State"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition focus:border-black/30 focus:bg-white"
              >
                <option value="active">Active</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>

              <select
                value={negotiable}
                onChange={(event) => setNegotiable(event.target.value)}
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition focus:border-black/30 focus:bg-white"
              >
                <option value="true">Negotiable</option>
                <option value="false">Fixed price</option>
              </select>
            </div>

            <input
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              type="text"
              placeholder="Subcategory"
              className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
            />

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={7}
              placeholder="Describe the item, usage, accessories, and any defects"
              className="rounded-[1.4rem] border border-black/10 bg-zinc-50 px-4 py-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleDelete()}
                className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete listing"}
              </button>
              <Link
                href={`/products/${listingId}`}
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-black/5"
              >
                Back to listing
              </Link>
            </div>
          </form>
        </Surface>
      </div>
    </div>
  );
}
