"use client";

import { signOut, useSession } from "next-auth/react";

export default function AdminHome() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">👑 Admin Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
