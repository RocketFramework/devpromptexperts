"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a
            href="/admin/consultants"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Consultants
          </a>
          <a
            href="/admin/blogs"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Blogs
          </a>
          <a
            href="/admin/payments"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Payments
          </a>
          <a
            href="/admin/consultation-requests"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Consultation Requests
          </a>
        </nav>
        <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
