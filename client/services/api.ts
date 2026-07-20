const DEFAULT_GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:3000";

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

function trimLeadingSlashes(value: string) {
  return value.replace(/^\/+/, "");
}

export function buildApiUrl(path: string) {
  return `${trimTrailingSlashes(DEFAULT_GATEWAY_BASE_URL)}/${trimLeadingSlashes(path)}`;
}

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(buildApiUrl(path), {
    credentials: "include",
    ...init,
  });
}
