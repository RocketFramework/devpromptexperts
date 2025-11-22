// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getAuthProviders } from "@/lib/auth-providers";
import { authCallbacks } from "@/lib/auth-callbacks";

const handler = NextAuth({
  providers: getAuthProviders(),
  
  callbacks: {
    async signIn(params) {
      console.log("🚨 SIGNIN CALLBACK - START");
      //return true;
      return authCallbacks.signIn(params);
    },
    async jwt(params) {
      return authCallbacks.jwt(params);
    },
    async session(params) {
      return authCallbacks.session(params);
    },
    async redirect(params) {
      return authCallbacks.redirect(params);
    },
  },

  pages: {
    signIn: "/auth/login/consultant",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };