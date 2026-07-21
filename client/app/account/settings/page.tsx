"use client";

import { useRouter } from "next/navigation";
import { Surface, SectionHeading } from "@/components/marketplace";
import { useAppContext } from "@/context/AppContext";
import { logout as logoutRequest } from "@/services/auth/api";

const settingsGroups = [
  {
    title: "Notifications",
    description: "Control how often the marketplace should reach out.",
    items: ["Message alerts", "Listing updates", "Price drop reminders"],
  },
  {
    title: "Privacy",
    description: "Decide what information is visible around your profile.",
    items: ["Profile visibility", "Contact details sharing", "Search discoverability"],
  },
  {
    title: "Marketplace",
    description: "Tune the buying and selling experience to your preference.",
    items: ["Default currency", "Saved locations", "Search filters"],
  },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAppContext();

  if (!user) return null;

  const handleLogout = async () => {
    await logoutRequest();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Settings"
          title="Platform settings"
          description="Manage how the marketplace behaves for your account."
        />
      </Surface>

      <div className="grid gap-6">
        {settingsGroups.map((group) => (
          <Surface key={group.title} className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-black">{group.title}</p>
            <p className="mt-2 text-sm leading-6 text-black/70">{group.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.1rem] border border-black/10 bg-zinc-50 px-4 py-4 text-sm text-black/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="p-6 sm:p-8">
        <p className="text-sm font-medium text-black/55">Account actions</p>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Hook your profile editing, notification preferences, or account deactivation
          flow into this page when those actions are ready.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex h-12 items-center justify-center rounded-[1.2rem] bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Sign out
          </button>
        </div>
      </Surface>
    </div>
  );
}
