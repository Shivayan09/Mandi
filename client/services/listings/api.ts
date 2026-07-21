import { apiFetch } from "@/services/api";
import { toListingView } from "./mapper";
import type { ApiEnvelope, BackendListing, ListingView } from "./types";

function readEnvelope<T>(response: Response) {
  return response.json() as Promise<ApiEnvelope<T>>;
}

export async function fetchListings(): Promise<ListingView[]> {
  const response = await apiFetch("/listing", { cache: "no-store" });
  const data = await readEnvelope<BackendListing>(response);
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load listings");
  }
  return (data.listings ?? []).map(toListingView);
}

export async function fetchMyListings(): Promise<ListingView[]> {
  const response = await apiFetch("/listing/me", { cache: "no-store" });
  const data = await readEnvelope<BackendListing>(response);
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load your listings");
  }
  return (data.listings ?? []).map(toListingView);
}

export async function fetchListing(listingId: string): Promise<ListingView | null> {
  const response = await apiFetch(`/listing/${encodeURIComponent(listingId)}`, {
    cache: "no-store",
  });
  const data = await readEnvelope<BackendListing>(response);
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load listing");
  }
  return data.listing ? toListingView(data.listing) : null;
}

export async function fetchListingRecord(listingId: string): Promise<BackendListing | null> {
  const response = await apiFetch(`/listing/${encodeURIComponent(listingId)}`, {
    cache: "no-store",
  });
  const data = await readEnvelope<BackendListing>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load listing");
  }

  return data.listing ?? null;
}

export async function createListing(formData: FormData) {
  const response = await apiFetch("/listing", {
    method: "POST",
    body: formData,
  });
  const data = await readEnvelope<BackendListing>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not publish listing");
  }
}

export async function updateListing(listingId: string, formData: FormData) {
  const response = await apiFetch(`/listing/${encodeURIComponent(listingId)}`, {
    method: "PATCH",
    body: formData,
  });
  const data = await readEnvelope<BackendListing>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not update listing");
  }

  return data.listing ?? null;
}

export async function deleteListing(listingId: string) {
  const response = await apiFetch(`/listing/${encodeURIComponent(listingId)}`, {
    method: "DELETE",
  });
  const data = await readEnvelope<BackendListing>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not delete listing");
  }
}
