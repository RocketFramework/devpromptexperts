import { NextAuthOptions } from "next-auth";
import { getAuthProviders } from "@/lib/auth-providers";
import { authCallbacks } from "@/lib/auth-callbacks";

export const authOptions: NextAuthOptions = {
  providers: getAuthProviders(),
  
  callbacks: {
    async signIn(params) {
      console.log("🚨 SIGNIN CALLBACK - START");
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

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === "development",
};
