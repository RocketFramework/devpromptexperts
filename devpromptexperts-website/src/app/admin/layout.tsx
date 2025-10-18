
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signOut } from "next-auth/react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // ✅ Redirect if not logged in
  if (!session) {
    redirect(`/auth/admin/login?callbackUrl=/admin/dashboard`);
  }

  // 🛡️ Role check
  if ((session.user as any).role !== "admin") {
    redirect("/unauthorized"); // Optional: create a proper Unauthorized page
  }

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
            onClick={() => signOut({ callbackUrl: "/auth/admin/login" })}
            className="mt-4 bg-red-600 text-white p-2 rounded w-full hover:bg-red-700 transition"
            >
            Logout
            </button>
        </aside>

        <main className="flex-1 p-6 bg-gray-100">{children}</main>
        </div>

  );
}
