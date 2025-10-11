"use client"; // MUST be client

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function useAdmin() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // still checking session
    if (!session || session.user.role !== "admin") {
      router.push("/auth/login"); // redirect non-admins
    }
  }, [session, status, router]);

  return { session, status };
}
