"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthPageShell } from "@/components/auth-page-shell";
import { useAppContext } from "@/context/AppContext";
import { register } from "@/services/auth/api";

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
      await register({
        name,
        email,
        phoneNumber,
        password,
      });
      const authenticatedUser = await refreshAuth();
      if (!authenticatedUser) {
        throw new Error("Unable to load your profile.");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Account creation failed.");
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
        <label className="grid gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/55">
            Full name
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Your name"
            className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:bg-white"
          />
        </label>
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
            Phone number
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            autoComplete="tel"
            placeholder="Mobile number"
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
            autoComplete="new-password"
            placeholder="Create a password"
            className="h-14 rounded-[1.2rem] border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:bg-white"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 h-14 rounded-[1.2rem] bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      {status ? <p className="mt-5 text-sm text-black/70">{status}</p> : null}
    </AuthPageShell>
  );
}
