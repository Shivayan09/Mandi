"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthPageShell } from "@/components/auth-page-shell";
import { useAppContext } from "@/context/AppContext";
import { login } from "@/services/auth/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, refreshAuth } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  const handleLogin = async () => {
    setSubmitting(true);
    setStatus(null);

    try {
      await login({ email, password });
      const authenticatedUser = await refreshAuth();
      if (!authenticatedUser) {
        throw new Error("Unable to load your profile.");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Sign in"
      title="Welcome back."
      description="Sign in to continue buying, selling, and messaging from your saved profile."
      primaryAction={{ href: "/auth/register", label: "Create account" }}
      secondaryAction={{ href: "/", label: "Browse marketplace" }}
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleLogin();
        }}
      >
        <label className="grid gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/55">
            Email address
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:bg-white"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/55">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:bg-white"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 h-14 rounded-[1.2rem] bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Continue"}
        </button>
      </form>

      {status ? <p className="mt-5 text-sm text-black/70">{status}</p> : null}
    </AuthPageShell>
  );
}
