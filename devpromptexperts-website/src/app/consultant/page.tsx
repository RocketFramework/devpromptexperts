"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConsultantOnboardingTable from "@/components/ConsultantOnboardingTable";
import { consultantDTOs } from "@/data/consultants";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non- users

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "consultant") return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Consultant Onboarding Requests
      </h1>
      <ConsultantOnboardingTable
        consultants={consultantDTOs}
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
