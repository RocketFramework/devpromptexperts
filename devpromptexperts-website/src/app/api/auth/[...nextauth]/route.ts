import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = "admin@example.com";
        const adminPassword = "123456";

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return { id: "1", name: "Admin", email: adminEmail, role: "admin" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/auth/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
};

// Export handler for App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // ✅ Only export handler here
