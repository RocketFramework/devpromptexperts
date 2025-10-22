// src/lib/profile-helpers.ts
import {
  ExtendedUser,
  SocialProfile,
  AuthProvider,
  LinkedInProfile,
  GoogleProfile,
  FacebookProfile,
} from "@/types/types";

export interface ExtractedProfileData {
  fullName: string;
  profileImageUrl: string | null;
  email: string;
  country: string;
}

export function extractProfileData(
  user: ExtendedUser,
  profile: SocialProfile | null | undefined,
  provider?: string
): ExtractedProfileData {
  const authProvider = provider as AuthProvider;

  switch (authProvider) {
    case "linkedin":
      return extractLinkedInData(user, profile as LinkedInProfile);
    case "google":
      return extractGoogleData(user, profile as GoogleProfile);
    case "facebook":
      return extractFacebookData(user, profile as FacebookProfile);
    case "credentials":
    default:
      return extractCredentialsData(user);
  }
}

function extractLinkedInData(
  user: ExtendedUser,
  profile?: LinkedInProfile
): ExtractedProfileData {
  const fullName = profile?.name || user.name || "Unknown User";
  const profileImageUrl = profile?.picture || user?.image || null;
  const email = profile?.email || user.email || "unknown@example.com";
  const country = profile?.locale?.toString() ?? 'Unknown';
  return { fullName, profileImageUrl, email, country };
}

function extractGoogleData(
  user: ExtendedUser,
  profile?: GoogleProfile
): ExtractedProfileData {
  const fullName =
    profile?.name ||
    `${profile?.given_name || ""} ${profile?.family_name || ""}`.trim() ||
    user.name ||
    "Unknown User";

  const profileImageUrl = profile?.picture ?? user?.image ?? null;
  const email = profile?.email || user.email || "unknown@example.com";
  const country = profile?.locale as string;
  return { fullName, profileImageUrl, email, country };
}

function extractFacebookData(
  user: ExtendedUser,
  profile?: FacebookProfile
): ExtractedProfileData {
  const fullName =
    profile?.name ||
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
    user.name ||
    "Unknown User";

  const profileImageUrl = profile?.picture?.data?.url ?? user?.image ?? null;
  const email = profile?.email || user.email || "unknown@example.com";
  const country = profile?.locale as string;
  return { fullName, profileImageUrl, email, country };
}

function extractCredentialsData(user: ExtendedUser): ExtractedProfileData {
  return {
    fullName: user.name || "Unknown User",
    profileImageUrl: user.image ?? null,
    email: user.email || "unknown@example.com",
    country: "Sri Lanka",
  };
}

export function determineUserRole(provider?: string): string {
  const authProvider = provider as AuthProvider;

  switch (authProvider) {
    case "linkedin":
      return "consultant";
    case "google":
    case "facebook":
      return "client";
    case "credentials":
    default:
      return "user"; // or whatever default role you want
  }
}
