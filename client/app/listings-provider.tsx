"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { productArt, type Product } from "@/app/marketplace-data";

const LISTING_BASE_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:3000";

type BackendListing = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  condition: "new" | "like_new" | "excellent" | "good" | "fair" | "poor";
  price: number;
  negotiable?: boolean;
  images?: {
    url: string;
    public_id: string;
  }[];
  location: {
    city: string;
    state: string;
    country?: string;
  };
  tags?: string[];
  status?: "active" | "reserved" | "sold" | "deleted";
  views?: number;
  favorites?: number;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
};

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

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  count?: number;
  listing?: T;
  listings?: T[];
};

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCondition(condition: BackendListing["condition"]) {
  switch (condition) {
    case "like_new":
      return "Like new";
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "fair":
      return "Fair";
    case "poor":
      return "Poor";
    case "new":
    default:
      return "New";
  }
}

function inferKind(title: string, category: string, brand?: string) {
  const text = `${title} ${category} ${brand ?? ""}`.toLowerCase();

  if (text.includes("headphone") || text.includes("earbud") || text.includes("audio")) {
    return "headphones";
  }
  if (text.includes("bike") || text.includes("scooter") || text.includes("royal")) {
    return "bike";
  }
  if (text.includes("laptop") || text.includes("macbook") || text.includes("computer")) {
    return "laptop";
  }
  if (text.includes("phone") || text.includes("iphone") || text.includes("mobile")) {
    return "phone";
  }
  if (text.includes("desk") || text.includes("table") || text.includes("chair")) {
    return "desk";
  }
  if (text.includes("camera") || text.includes("dslr") || text.includes("lens")) {
    return "camera";
  }
  if (text.includes("keyboard") || text.includes("piano") || text.includes("synth")) {
    return "keyboard";
  }

  return "speaker";
}

function relativeTime(dateString?: string) {
  if (!dateString) return "Just listed";
  const created = new Date(dateString).getTime();
  if (Number.isNaN(created)) return "Just listed";
  const diff = Date.now() - created;
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

function titleCase(value: string) {
  return value
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeListing(listing: BackendListing): Product {
  const kind = inferKind(listing.title, listing.category, listing.brand);
  const location = [listing.location?.city, listing.location?.state]
    .filter(Boolean)
    .join(", ");
  const image =
    listing.images?.[0]?.url ??
    productArt(kind, listing.title);
  const tags = Array.from(
    new Set([
      ...(listing.tags ?? []),
      listing.negotiable === false ? "Fixed price" : "Negotiable",
      titleCase(listing.status ?? "active"),
    ]),
  ).slice(0, 3);

  return {
    slug: listing._id,
    title: listing.title,
    category: listing.category,
    categorySlug: slugify(listing.category),
    kind,
    price: `₹${Number(listing.price).toLocaleString("en-IN")}`,
    condition: formatCondition(listing.condition),
    location: location || listing.location?.country || "Unknown",
    posted: relativeTime(listing.createdAt),
    description: listing.description,
    longDescription: listing.description,
    highlights: [
      listing.negotiable === false ? "Fixed price" : "Negotiable price",
      listing.brand ? listing.brand : "Direct owner listing",
      listing.status ? titleCase(listing.status) : "Active listing",
    ],
    specs: [
      { label: "Brand", value: listing.brand || "Unknown" },
      { label: "Subcategory", value: listing.subCategory || "General" },
      { label: "Status", value: titleCase(listing.status ?? "active") },
      { label: "Location", value: location || listing.location?.country || "Unknown" },
    ],
    tags,
    seller: {
      name: `Seller ${listing.userId.slice(-4)}`,
      verified: false,
      response: "Message the seller to ask about condition and pickup.",
      rating: "New",
      location: location || "Online",
    },
    stats: {
      views: String(listing.views ?? 0),
      chats: "0",
    },
    palette: {
      light: "#ffffff",
      mid: "#ffffff",
      dark: "#111111",
    },
    image,
  };
}

async function getAllListings() {
  const response = await axios.get<ApiEnvelope<BackendListing>>(
    buildUrl(LISTING_BASE_URL, "/listing"),
    { withCredentials: true },
  );
  return response.data;
}

async function createListing(input: ListingInput) {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("category", input.category);

  if (input.subCategory) {
    formData.append("subCategory", input.subCategory);
  }

  if (input.brand) {
    formData.append("brand", input.brand);
  }

  formData.append("condition", input.condition);
  formData.append("price", input.price.toString());

  formData.append(
    "negotiable",
    String(input.negotiable ?? true)
  );

  formData.append(
    "location",
    JSON.stringify(input.location)
  );

  if (input.tags) {
    formData.append(
      "tags",
      JSON.stringify(input.tags)
    );
  }

  if (input.expiresAt) {
    formData.append(
      "expiresAt",
      input.expiresAt
    );
  }

  input.images.forEach((image) => {
    formData.append("images", image);
  });

  const response =
    await axios.post<ApiEnvelope<BackendListing>>(
      buildUrl(LISTING_BASE_URL, "/listing"),
      formData,
      {
        withCredentials: true,
      }
    );

  return response.data;
}

async function updateListing(
  listingId: string,
  input: Partial<ListingInput>
) {

  const formData = new FormData();

  if (input.title)
    formData.append("title", input.title);

  if (input.description)
    formData.append(
      "description",
      input.description
    );

  if (input.category)
    formData.append(
      "category",
      input.category
    );

  if (input.subCategory)
    formData.append(
      "subCategory",
      input.subCategory
    );

  if (input.brand)
    formData.append(
      "brand",
      input.brand
    );

  if (input.condition)
    formData.append(
      "condition",
      input.condition
    );

  if (input.price !== undefined)
    formData.append(
      "price",
      input.price.toString()
    );

  if (input.negotiable !== undefined)
    formData.append(
      "negotiable",
      String(input.negotiable)
    );

  if (input.location)
    formData.append(
      "location",
      JSON.stringify(input.location)
    );

  if (input.tags)
    formData.append(
      "tags",
      JSON.stringify(input.tags)
    );

  if (input.expiresAt)
    formData.append(
      "expiresAt",
      input.expiresAt
    );

  if (input.images) {
    input.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response =
    await axios.patch<ApiEnvelope<BackendListing>>(
      buildUrl(
        LISTING_BASE_URL,
        `/listing/${listingId}`
      ),
      formData,
      {
        withCredentials: true,
      }
    );

  return response.data;
}

async function deleteListing(listingId: string) {
  const response = await axios.delete<ApiEnvelope<BackendListing>>(
    buildUrl(LISTING_BASE_URL, `/listing/${encodeURIComponent(listingId)}`),
    { withCredentials: true, data: {} },
  );
  return response.data;
}

type ListingsContextValue = {
  listings: Product[];
  loading: boolean;
  error: string | null;
  refreshListings: () => Promise<void>;
  addListing: (input: ListingInput) => Promise<Product>;
  editListing: (listingId: string, input: Partial<ListingInput>) => Promise<Product>;
  removeListing: (listingId: string) => Promise<void>;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllListings();
      const items = response.listings ?? [];
      setListings(items.map((item) => normalizeListing(item)));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load listings"));
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshListings();
  }, [refreshListings]);

  const value = useMemo<ListingsContextValue>(
    () => ({
      listings,
      loading,
      error,
      refreshListings,
      addListing: async (input) => {
        try {
          const response = await createListing(input);
          const listing = response.listing;

          if (!listing) {
            throw new Error(response.message ?? "Listing could not be created");
          }

          const product = normalizeListing(listing);
          setListings((current) => [product, ...current]);
          return product;
        } catch (error) {
          throw new Error(getErrorMessage(error, "Listing could not be created"));
        }
      },
      editListing: async (listingId, input) => {
        try {
          const response = await updateListing(listingId, input);
          const listing = response.listing;

          if (!listing) {
            throw new Error(response.message ?? "Listing could not be updated");
          }

          const product = normalizeListing(listing);
          setListings((current) =>
            current.map((item) => (item.slug === listingId ? product : item)),
          );
          return product;
        } catch (error) {
          throw new Error(getErrorMessage(error, "Listing could not be updated"));
        }
      },
      removeListing: async (listingId) => {
        try {
          await deleteListing(listingId);
          setListings((current) => current.filter((item) => item.slug !== listingId));
        } catch (error) {
          throw new Error(getErrorMessage(error, "Listing could not be deleted"));
        }
      },
    }),
    [error, listings, loading, refreshListings],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingsContext);

  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }

  return context;
}
