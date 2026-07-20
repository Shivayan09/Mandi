export type AppUser = {
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  provider?: "local" | "google";
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
};
