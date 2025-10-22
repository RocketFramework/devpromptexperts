// src/lib/auth-providers.ts
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";

export const getAuthProviders = (): Provider[] => [
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
        let country = "Unknown";
        let language = "Unknown";

        if (typeof profile?.locale === "object" && profile?.locale !== null) {
          const l = profile?.locale as { country?: string; language?: string };
          language = l.language ?? "Unknown";
          country = l.country ?? "Unknown";
        } else if (typeof profile?.locale === "string") {
          language = profile?.locale;
          country = profile?.locale.split("_")[1] ?? "Unknown";
        } else {
          language = "Unknown";
          country = "Unknown";
        }

        return {
          id: profile.sub, // OIDC uses 'sub'
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          locale: profile.locale, // keep the raw value if you want
          country,
          language,
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

    // 🧩 Google
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ];