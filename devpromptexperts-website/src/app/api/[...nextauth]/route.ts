// src/app/api/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 1️⃣ Extend the User type to include role
interface AdminUser extends User {
  role: "admin";
}

// 2️⃣ Define NextAuth options
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // 3️⃣ Properly typed authorize function
      async authorize(credentials): Promise<AdminUser | null> {
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

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 4️⃣ JWT callback
    async jwt({ token, user }) {
      if (user) {
        // user is AdminUser here
        token.role = (user as AdminUser).role;
      }
      return token;
    },

    // 5️⃣ Session callback
    async session({ session, token }) {
      if (session.user) {
        // session.user is the normal User type; cast to AdminUser
        (session.user as AdminUser).role = token.role as "admin";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
