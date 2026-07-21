"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Surface } from "@/components/marketplace";
import { createListing } from "@/services/listings/api";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const {user} = useAppContext();
  const router = useRouter();

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const publishListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const normalizedTitle = title.trim();
      const normalizedDescription = description.trim();
      const normalizedCategory = category.trim();
      const normalizedLocation = location.trim();
      const normalizedBrand = brand.trim();
      const parsedPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
      const uploadedImages = images.filter(Boolean);
      if (!normalizedTitle) throw new Error("Add a product title.");
      if (!normalizedDescription) throw new Error("Add a description.");
      if (!normalizedCategory) throw new Error("Add a category.");
      if (!condition) throw new Error("Choose a condition.");
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) throw new Error("Enter a valid price.");
      if (!normalizedLocation) throw new Error("Add a location.");
      if (uploadedImages.length === 0) throw new Error("Add at least one product photo.");
      const [cityPart, statePart] = normalizedLocation.split(",").map((part) => part.trim()).filter(Boolean);
      const formData = new FormData();
      formData.append("title", normalizedTitle);
      formData.append("description", normalizedDescription);
      formData.append("category", normalizedCategory);
      formData.append("condition", condition);
      formData.append("price", parsedPrice.toString());
      if (normalizedBrand) {
        formData.append("brand", normalizedBrand);
      }
      formData.append(
        "location",
        JSON.stringify({
          city: cityPart ?? normalizedLocation,
          state: statePart ?? "Unknown",
          country: "India",
        }),
      );
      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });
      await createListing(formData);
      window.location.assign("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["electronics","vehicles","fashion","books","furniture","sports","real_estate","services","jobs","others",];

  return (
    user ? (<div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Surface className="p-6 sm:p-8 lg:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">List an item</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
            Build a live listing.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
            Keep it simple, add at least one photo, and send the fields the backend needs so the
            item shows up immediately in the marketplace.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={publishListing}>
            <div>
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                Product media
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <label
                    key={index}
                    className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-[1.2rem] border border-dashed border-black/25 bg-zinc-50 transition hover:bg-zinc-100"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleImageChange(event, index)}
                    />

                    {previews[index] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[index]}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400 transition group-hover:text-zinc-700">
                        <Plus className="h-5 w-5" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                The backend needs at least one image. You can upload up to three here.
              </p>
            </div>

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
                  Select Category
                </option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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
                placeholder="Location"
                className="h-14 rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
              />
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
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
          </form>
        </Surface>

        <aside className="space-y-6 pt-1">
          <div className="border-b border-black/10 pb-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
              Backend contract
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              Send the fields the API actually uses.
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
              <p>Required: title, description, category, condition, price, location, images.</p>
              <p>Location is posted as JSON from the text you enter here.</p>
              <p>Images are uploaded as repeated `images` files, which matches the route.</p>
            </div>
          </div>

          <div className="border-b border-black/10 pb-6">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
              Before publishing
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
              <p>- Use a clear title that matches the item buyers will search for.</p>
              <p>- Put the city and state in location so the product map can place it correctly.</p>
              <p>- Add one strong photo first. The rest can show details, flaws, or accessories.</p>
              <p>- Keep the description honest so the listing closes faster.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>)
    : (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-3">
          <p>Log in to list and sell your items</p>
          <button onClick={() => {router.push('/auth/login')}} className="bg-black transition-all hover:bg-black/80 text-white px-5 py-2 rounded-xl cursor-pointer">
            Continue to Log in
          </button>
        </div>
      </div>
    )
  );
}
