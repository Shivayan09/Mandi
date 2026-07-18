"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthPageShell } from "../_components/auth-page-shell";
import { useAppContext } from "@/context/AppContext";

const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

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

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, refreshAuth } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  const handleRegister = async () => {
    setSubmitting(true);
    setStatus(null);

    try {
      await axios.post(
        buildUrl(GATEWAY_BASE_URL, "/auth/register"),
        {
          name,
          email,
          phoneNumber,
          password,
        },
        { withCredentials: true },
      );
      const authenticatedUser = await refreshAuth();
      if (!authenticatedUser) {
        throw new Error("Unable to load your profile.");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      setStatus(getErrorMessage(error, "Account creation failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Create account"
      title="Create your account."
      description="Set up your profile once and use it across the marketplace, messages, and saved items."
      primaryAction={{ href: "/auth/login", label: "Sign in" }}
      secondaryAction={{ href: "/", label: "Browse marketplace" }}
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleRegister();
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white"
        />
        <input
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="Phone number"
          className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white"
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-14 rounded-[1.2rem] bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      {status ? <p className="mt-5 text-sm text-black/70">{status}</p> : null}
    </AuthPageShell>
  );
}
