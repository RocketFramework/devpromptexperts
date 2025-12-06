"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import RFPForm, { RFPCreationData } from "@/components/client/RFPForm";
import { ProjectRequestsService } from "@/services/generated";
import { 
  ProjectStatus, 
  ProjectMode, 
  BudgetRange, 
  Timeline, 
  UrgencyLevel, 
  LocationPreference, 
  PreferredContactMethod 
} from "@/types";

export default function CreateRFPPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.client_id as string;
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: RFPCreationData, isDraft: boolean) => {
    if (!session?.user?.id) {
      alert("Please sign in to create a project");
      return;
    }

    try {
      setIsSubmitting(true);
      const projectData = {
        ...data,
        client_id: clientId || session?.user?.id || "",
        status: isDraft ? ProjectStatus.DRAFT : ProjectStatus.OPEN,
        published_at: isDraft ? null : new Date().toISOString(),
        // Ensure required fields are present and cast to string if needed
        budget_range: data.budget_range!,
        project_mode: data.project_mode!,
        timeline: data.timeline!,
      };

      await ProjectRequestsService.create(projectData);
      alert(isDraft ? "Draft saved successfully!" : "RFP published successfully!");
      router.push(`/client/${clientId}/rfp`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New RFP / RFI
          </h1>
        </div>
        <RFPForm
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/client/${clientId}/rfp`)}
          isSubmitting={isSubmitting}
        />
      </div>
    </ClientDashboardLayout>
  );
}
