"use client";

import { Surface, SectionHeading } from "@/components/marketplace";
import { useAppContext } from "@/context/AppContext";

export default function PersonalInfoPage() {
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Personal"
          title="Personal info"
          description="Review the contact and identity details attached to your account."
        />
      </Surface>

      <Surface className="p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={user.name || "Not provided"} />
          <Field label="Email address" value={user.email} />
          <Field label="Phone number" value={user.phoneNumber || "Not added"} />
          <Field label="Account ID" value={user.userId} mono />
          <Field
            label="Login method"
            value={user.provider === "google" ? "Google SSO" : "Email and password"}
          />
          <Field
            label="Email status"
            value={user.emailVerified ? "Verified" : "Pending verification"}
          />
        </div>
      </Surface>

      <Surface className="p-6 sm:p-8">
        <p className="text-sm font-medium text-black/55">Notes</p>
        <p className="mt-3 text-sm leading-6 text-black/70">
          These values are read from your authenticated profile. If you need to update
          them, connect them to your edit profile flow or account settings page.
        </p>
      </Surface>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/10 bg-zinc-50 px-4 py-4">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-black/45">{label}</p>
      <p className={`mt-2 text-sm font-medium ${mono ? "font-mono text-xs" : "text-black"}`}>
        {value}
      </p>
    </div>
  );
}
