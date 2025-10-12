// app/admin/onboarding/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConsultantOnboardingTable from "@/components/ConsultantOnboardingTable";
import { consultants } from "@/data/consultants";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-admin users
  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (!session || session.user.role !== "admin") {
      router.push("/auth/login"); // redirect to login if not admin
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Consultant Onboarding Requests
      </h1>
      <ConsultantOnboardingTable
        consultants={consultants}
        sortKey="name" // or any default key like 'email', 'country'
        sortOrder="asc"
        onSort={(key) => {
          console.log("Sorting by", key);
          // Add sorting logic here
        }}
        onStageUpdate={async (id, newStage) => {
          console.log(`Updating consultant ${id} to stage ${newStage}`);
          // Add update logic here
        }}
      />
    </div>
  );
}
