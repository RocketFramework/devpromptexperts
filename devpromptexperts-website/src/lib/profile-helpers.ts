// src/lib/profile-helpers.ts
import { SocialProfile, LinkedInProfile, ExtendedUser } from "@/types/types";

export interface ProfileData {
  fullName: string;
  profileImageUrl: string | null;
  email: string | null;
}

export const extractProfileData = (
  user: ExtendedUser | null,
  profile?: SocialProfile | null,
  provider?: string
): ProfileData => {
  let fullName = user?.name || profile?.name || "";
  const email = user?.email || profile?.email || null;

  // Handle LinkedIn-specific name structure
  if (provider === "linkedin" && profile) {
    const linkedInProfile = profile as LinkedInProfile;
    if (linkedInProfile.localizedFirstName || linkedInProfile.localizedLastName) {
      fullName = `${linkedInProfile.localizedFirstName || ""} ${
        linkedInProfile.localizedLastName || ""
      }`.trim();
    }
  }

  const profileImageUrl =
    user?.image ||
    profile?.picture ||
    profile?.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier ||
    null;

  return { fullName, profileImageUrl, email };
};

export const determineUserRole = (provider: string): string => {
  const roleMap: Record<string, string> = {
    linkedin: "consultant",
    credentials: "admin",
  };
  
  return roleMap[provider] || "client";
};