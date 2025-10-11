'use client'; // <--- important

import useAdmin from "@/hooks/useAdmin";

export default function AdminPage() {
  const { session, status } = useAdmin();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {session?.user.name}</p>
      {/* Your admin content goes here */}
    </div>
  );
}
