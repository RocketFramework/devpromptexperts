// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { Account } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { AuthAuditService } from "@/services/AuthAuditService";
import { ClientService } from "@/services/ClientService";
import { ConsultantService } from "@/services/ConsultantService";
import { ProviderAccountService } from "@/services/ProviderAccountService";
import { UserService } from "@/services/UserService";
import {
  ExtendedUser,
  SocialProfile,
  LinkedInProfile,
} from "@/types/types";

const handler = NextAuth({
  providers: [
    // 🧩 Admin Login (Credentials)
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USER &&
          credentials?.password === process.env.ADMIN_PASS
        ) {
          return { id: "1", name: "Master Admin", role: "admin" };
        }
        return null;
      },
    }),

    // 🧩 LinkedIn - FIXED CONFIGURATION
    // 🧩 LinkedIn - Using OIDC API consistently
    {
      id: "linkedin",
      name: "LinkedIn",
      type: "oauth",
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,

      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "openid profile email",
          response_type: "code",
        },
      },

      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
        async request(context) {
          const params = new URLSearchParams({
            grant_type: "authorization_code",
            code: context.params.code!,
            client_id: process.env.LINKEDIN_CLIENT_ID!,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            redirect_uri: context.provider.callbackUrl,
          });

          const response = await fetch(
            "https://www.linkedin.com/oauth/v2/accessToken",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: params,
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `LinkedIn token error: ${response.status} ${errorText}`
            );
          }

          const tokens = await response.json();
          return { tokens };
        },
      },

      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
        async request(context) {
          const response = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("LinkedIn userinfo error:", errorText);
            throw new Error(
              `LinkedIn userinfo error: ${response.status} ${errorText}`
            );
          }

          const profile = await response.json();
          return profile;
        },
      },

      profile(profile) {
        // LinkedIn OIDC profile structure
        return {
          id: profile.sub, // OIDC uses 'sub'
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },

      checks: ["none"],
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    },

    // 🧩 Facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  // 🧠 Custom Callbacks
  callbacks: {
    // 🔹 Handle JWT creation
    async jwt({ token, user, account, profile, trigger, session }) {
      if (account) {
        // Role mapping per provider
        if (account.provider === "credentials")
          token.role = (user as ExtendedUser)?.role || "admin";
        if (account.provider === "google") token.role = "customer";
        if (account.provider === "facebook") token.role = "customer";
        if (account.provider === "linkedin") token.role = "consultant";

        // Provider profile data with proper typing
        if (profile) {
          const typedProfile = profile as SocialProfile;

          // Handle LinkedIn's specific profile structure
          if (account.provider === "linkedin") {
            // Use the id from LinkedIn profile
            if (typedProfile.id && !token.sub) {
              token.sub = typedProfile.id;
            }
          }

          token.providerData = {
            ...(token.providerData || {}),
            [account.provider]: typedProfile,
          };
        }
      }

      // Preserve role when updating session
      if (trigger === "update" && session?.user?.role)
        token.role = session.user.role;

      return token;
    },

    // 🔹 Session Callback (adds custom fields)
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.loginContext = token.loginContext;
      session.user.providerData = token.providerData || {};
      return session;
    },
  },

  // 🧩 Enterprise-Grade Data Sync Events
  // Updated signIn event in your route.ts
  events: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: ExtendedUser;
      account?: Account | null;
      profile?: SocialProfile | null;
    }) {
      try {
        if (!account) return;

        const provider = account.provider;
        const providerId = account.providerAccountId ?? null;
        const email = user?.email || profile?.email || null;

        // Extract name based on provider
        let fullName = user?.name || profile?.name || "";

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
          profile?.profilePicture?.["displayImage~"]?.elements?.[0]
            ?.identifiers?.[0]?.identifier ||
          null;

        // Determine role
        let role = "client";
        if (provider === "linkedin") {
          role = "consultant";
        } else if (provider === "credentials") {
          role = "admin";
        }

        // 1️⃣ Upsert user
        const userData = await UserService.upsertUser({
          email,
          full_name: fullName,
          role,
          profile_image_url: profileImageUrl,
        });

        const userId = userData.id;
        const userRole = userData.role;

        // 2️⃣ Upsert role-specific table
        if (userRole === "consultant") {
          await ConsultantService.upsertConsultant({
            user_id: userId,
            linkedinUrl: profile?.linkedinUrl || null,
          });
        } else if (userRole === "client") {
          await ClientService.upsertClient(userId);
        }

        // 3️⃣ Upsert provider account
        await ProviderAccountService.upsertProviderAccount({
          user_id: userId,
          provider: provider,
          provider_account_id: providerId,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
          scope: account.scope,
          raw_profile: profile,
        });

        // 4️⃣ Log successful auth
        await AuthAuditService.logAuthEvent({
          user_id: userId,
          email: email,
          provider: provider,
          success: true,
          notes: `Signed in via ${provider} as ${userRole}`,
        });

        console.log(`✅ Successfully synced ${userRole} user: ${email}`);

      } catch (err) {
        console.error("❌ Error in Supabase sync:", err);

        // Log failed auth attempt
        await AuthAuditService.logAuthEvent({
          email: user?.email || null,
          provider: account?.provider || null,
          success: false,
          notes: `Sync error: ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    },
  },

  pages: {
    signIn: "/auth/login/consultant", // default fallback
    error: "/auth/error",
  },

  debug: true,
});

export { handler as GET, handler as POST };
