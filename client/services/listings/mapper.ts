import { slugify, titleCase } from "@/lib/utils";
import type { BackendListing, ListingView } from "./types";

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

function buildLocation(listing: BackendListing) {
  return [listing.location?.city, listing.location?.state, listing.location?.country]
    .filter(Boolean)
    .join(", ");
}

export function toListingView(listing: BackendListing): ListingView {
  const location = buildLocation(listing);
  const price = `\u20B9${Number(listing.price).toLocaleString("en-IN")}`;
  const sellerName = listing.seller?.name?.trim() || `Seller ${listing.userId.slice(-4)}`;
  const tags = Array.from(
    new Set([
      ...(listing.tags ?? []),
      listing.negotiable === false ? "Fixed price" : "Negotiable",
      titleCase(listing.status ?? "active"),
    ]),
  ).slice(0, 4);

  return {
    ownerId: listing.userId,
    slug: listing._id,
    title: listing.title,
    category: listing.category,
    categorySlug: slugify(listing.category),
    price,
    condition: formatCondition(listing.condition),
    location: location || "Unknown",
    posted: relativeTime(listing.createdAt),
    description: listing.description,
    longDescription: listing.description,
    tags,
    imageUrl: listing.images?.[0]?.url ?? null,
    seller: {
      name: sellerName,
      verified: false,
      response: "Message the seller to ask about condition and pickup.",
      rating: "New",
      location: location || "Online",
    },
    specs: [
      { label: "Brand", value: listing.brand?.trim() || "Not listed" },
      { label: "Subcategory", value: listing.subCategory?.trim() || "General" },
      { label: "Status", value: titleCase(listing.status ?? "active") },
      { label: "Negotiable", value: listing.negotiable === false ? "No" : "Yes" },
    ],
    status: titleCase(listing.status ?? "active"),
    negotiable: listing.negotiable ?? true,
    views: listing.views ?? 0,
    favorites: listing.favorites ?? 0,
  };
}
