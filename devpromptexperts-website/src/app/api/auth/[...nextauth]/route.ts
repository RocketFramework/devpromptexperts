// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getAuthProviders } from "@/lib/auth-providers";
import { authCallbacks } from "@/lib/auth-callbacks";
import { AuthSyncService } from "@/services/AuthSyncService";

const handler = NextAuth({
  providers: getAuthProviders(),
  
  callbacks: authCallbacks,

  events: {
    async signIn({ user, account, profile }) {
      await AuthSyncService.handleUserSync({ user, account, profile });
    },
  },

  pages: {
    signIn: "/auth/login/consultant",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };