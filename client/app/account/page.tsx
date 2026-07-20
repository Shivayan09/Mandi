"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { InfoPill, SectionHeading, StatCard, Surface } from "@/components/marketplace";
import { useAppContext } from "@/context/AppContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAppContext();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Surface className="px-6 py-5 text-sm text-black/70 shadow-[0_18px_60px_rgba(17,17,17,0.06)]">
          Loading account...
        </Surface>
      </div>
    );
  }

  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const authLabel = user.provider === "google" ? "Google SSO" : "Email and password";
  const verificationLabel = user.emailVerified ? "Verified" : "Pending verification";
  const onboardingLabel = user.onboardingCompleted ? "Complete" : "Needs attention";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Surface className="overflow-hidden">
          <div className="border-b border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.08),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8f6f2_100%)] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex gap-5 items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-black/10 bg-black text-lg font-semibold text-white shadow-[0_12px_30px_rgba(17,17,17,0.12)]">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <p className="text-[0.65rem] uppercase tracking-[0.34em] text-black/55">
                    Account
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                    {user.name}
                  </h1>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <InfoPill label="Email" value={user.email} />
                    <InfoPill label="Phone" value={user.phoneNumber || "Not added"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Authentication"
                value={authLabel}
                detail="How this account signs in today."
              />
              <StatCard
                label="Verification"
                value={verificationLabel}
                detail="Whether the email on file is confirmed."
              />
              <StatCard
                label="Onboarding"
                value={onboardingLabel}
                detail="Progress for profile completion."
              />
            </div>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Profile"
              title="Account details"
              description="These are the details currently attached to your account."
            />

            <div className="mt-8 divide-y divide-black/10 border-t border-black/10">
              <DetailRow label="Full name" value={user.name || "Not provided"} />
              <DetailRow label="Email address" value={user.email} />
              <DetailRow label="Phone number" value={user.phoneNumber || "Not added"} />
              <DetailRow label="Login method" value={authLabel} />
              <DetailRow
                label="Email status"
                value={user.emailVerified ? "Verified" : "Waiting for verification"}
              />
              <DetailRow
                label="Onboarding"
                value={user.onboardingCompleted ? "Completed" : "Action required"}
              />
              <DetailRow
                label="User ID"
                value={<span className="font-mono text-xs text-black/55">{user.userId}</span>}
              />
            </div>
          </Surface>

          <div className="grid gap-6">
            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Actions"
                title="Quick links"
                description="Jump straight into the main parts of the marketplace."
              />

              <div className="mt-6 grid gap-3">
                <ActionLink href="/sell" label="Create listing" description="Start selling an item" />
                <ActionLink href="/products" label="Browse products" description="Explore current listings" />
                <ActionLink href="/messages" label="Open messages" description="Continue conversations" />
              </div>
            </Surface>

            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Session"
                title="Account controls"
                description="Log out when you are done on this device."
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => void handleLogout()}
                  className="inline-flex h-12 items-center justify-center rounded-[1.2rem] bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  Sign out
                </button>
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-[1.2rem] border border-black/10 bg-white px-5 text-sm font-semibold text-black/70 transition hover:border-black hover:text-black"
                >
                  Back to marketplace
                </Link>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-black/55">{label}</span>
      <span className="text-sm font-medium text-black">{value}</span>
    </div>
  );
}

function ActionLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.25rem] border border-black/10 bg-white px-4 py-4 transition hover:border-black/20 hover:shadow-[0_10px_30px_rgba(17,17,17,0.05)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-black">{label}</p>
          <p className="mt-1 text-sm text-black/60">{description}</p>
        </div>
        <span className="text-black/35 transition group-hover:translate-x-0.5 group-hover:text-black">
          {"->"}
        </span>
      </div>
    </Link>
  );
}
