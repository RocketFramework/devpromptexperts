import { ReactNode } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Providers } from "@/components/Providers"; 

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
      <div className="min-h-screen flex">
        <Providers>
        <AdminNavbar />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
        </Providers>
      </div>
  );
}
