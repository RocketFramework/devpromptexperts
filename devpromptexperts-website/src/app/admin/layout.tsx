"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminUser {
  name?: string | null;
  email?: string | null;
  role: "admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const user = session?.user as AdminUser | undefined;
    if (!user || user.role !== "admin") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  const user = session?.user as AdminUser | undefined;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex">
        <aside className="w-64 bg-gray-200 text-black p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2 pl-4 border-l-2 border-gray-400">
            <a href="/admin/dashboard"
                className="block hover:bg-white p-2 rounded transition">
                Dashboard
            </a>

            <a href="/admin/users"
                className="block hover:bg-white p-2 rounded transition">
                Users
            </a>

            <a href="/admin/consultants-onboardings"
                className="block hover:bg-white p-2 rounded transition">
                Consultants
            </a>

            <a href="/admin/consultation-requests"
                className="block hover:bg-white p-2 rounded transition">
                Consultantation-Requests
            </a>

            
            <a href="/admin/payments"
                className="block hover:bg-white p-2 rounded transition">
                Payments
            </a>

            <a href="/admin/blog-management"
                className="block hover:bg-white p-2 rounded transition">
                Blog-Management
            </a>
            </nav>

            <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="mt-4 bg-red-600 text-white p-2 rounded w-full hover:bg-red-700 transition"
            >
            Logout
            </button>
        </aside>

        <main className="flex-1 p-6 bg-gray-100">{children}</main>
        </div>

  );
}
