"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import RFPForm, { RFPCreationData } from "@/components/client/RFPForm";
import { ProjectRequestsService } from "@/services/generated";
import {
  ProjectRequestStatus as ProjectStatus,
  BudgetRange,
  Timeline,
  ProjectMode,
  UrgencyLevel,
  LocationPreference,
  PreferredContactMethod,
} from "@/types";

export default function EditRFPPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const clientId = params.client_id as string;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<RFPCreationData>>({});

  useEffect(() => {
    if (id) {
      loadProjectRequest(id);
    }
  }, [id]);

  const loadProjectRequest = async (projectId: string) => {
    try {
      setIsLoading(true);
      const response = await ProjectRequestsService.findById(projectId);
      const project = response;
      
      if (project) {
        setInitialData({
          client_id: project.client_id,
          title: project.title,
          description: project.description,
          project_summary: project.project_summary || project.description,
          required_skills: project.required_skills || [],
          preferred_industries: project.preferred_industries || [],
          preferred_engagement_types: project.preferred_engagement_types || [],
          budget_range: (project.budget_range as BudgetRange) || BudgetRange.FIVE_TO_10K,
          timeline: (project.timeline as Timeline) || Timeline.TWO_TO_THREE_MONTHS,
          project_mode: (project.project_type as ProjectMode) || ProjectMode.ONE_TIME,
          type: (project.type as "RFP" | "RFI" | "Casual Inquiry") || "RFP",
          urgency_level: (project.urgency_level as UrgencyLevel) || UrgencyLevel.MEDIUM,
          location_preference: (project.location_preference as LocationPreference) || LocationPreference.ANY,
          specific_location: project.specific_location || "",
          client_availability: project.client_availability || "",
          preferred_contact_method: (project.preferred_contact_method as PreferredContactMethod) || PreferredContactMethod.EMAIL,
          deadline: project.deadline ? new Date(project.deadline).toISOString().slice(0, 16) : "",
        });
      }
    } catch (error) {
      console.error("Error loading project:", error);
      alert("Failed to load project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: RFPCreationData, isDraft: boolean) => {
    try {
      setIsSubmitting(true);
      const projectData = {
        ...data,
        status: isDraft ? ProjectStatus.DRAFT : ProjectStatus.OPEN,
        published_at: isDraft ? null : new Date().toISOString(),
        // Ensure required fields are present and cast to string if needed
        budget_range: data.budget_range!,
        project_mode: data.project_mode!,
        timeline: data.timeline!,
      };

      await ProjectRequestsService.update(id, projectData);
      alert(isDraft ? "Draft updated successfully!" : "RFP updated and published successfully!");
      router.push(`/client/${clientId}/rfp`);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading project details...
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Project Request
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Editing Mode
          </div>
        </div>
        <RFPForm
          initialData={initialData}
          isEditing={true}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/client/${clientId}/rfp`)}
          isSubmitting={isSubmitting}
        />
      </div>
    </ClientDashboardLayout>
  );
}
