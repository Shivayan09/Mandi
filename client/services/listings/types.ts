export type BackendListing = {
  _id: string;
  userId: string;
  seller?: {
    userId: string;
    name: string;
  } | null;
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

export type ListingView = {
  ownerId: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  price: string;
  condition: string;
  location: string;
  posted: string;
  description: string;
  longDescription: string;
  tags: string[];
  imageUrl: string | null;
  seller: {
    name: string;
    verified: boolean;
    response: string;
    rating: string;
    location: string;
  };
  specs: Array<{ label: string; value: string }>;
  status: string;
  negotiable: boolean;
  views: number;
  favorites: number;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  count?: number;
  listing?: T;
  listings?: T[];
};
