import { apiFetch } from "@/services/api";
import type { AppUser } from "./types";

type AuthEnvelope = {
  user?: AppUser;
  message?: string;
};

async function readAuthEnvelope(response: Response) {
  return (await response.json()) as AuthEnvelope;
}

function getMessage(data: AuthEnvelope, fallback: string) {
  return data.message ?? fallback;
}

export async function getCurrentUser() {
  const response = await apiFetch("/auth/me", { cache: "no-store" });
  const data = await readAuthEnvelope(response);

  if (!response.ok) {
    return null;
  }

  return data.user ?? null;
}

export async function login(payload: { email: string; password: string }) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await readAuthEnvelope(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "Login failed."));
  }
}

export async function register(payload: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await readAuthEnvelope(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "Account creation failed."));
  }
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  } catch {
    
  }
}
