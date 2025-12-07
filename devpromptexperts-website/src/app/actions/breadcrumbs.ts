"use server";

import { ExtendedClientsService } from "@/services/extended/ExtendedClientsService";
import { ProjectRequestsService } from "@/services/generated/ProjectRequestsService";

/**
 * Resolves a human-readable label for a given segment (UUID).
 * @param segment The UUID segment to resolve.
 * @param type The type of resource ('client' or 'rfp').
 * @returns The resolved name or null if not found.
 */
export async function resolveBreadcrumbLabel(segment: string, type: string): Promise<string | null> {
  if (!segment) return null;

  try {
    if (type === "client") {
      // Try to find by ID first (assuming segment is ID)
      // Note: ExtendedClientsService.findByUser_Id takes a user_id, but the URL param might be client ID.
      // We should check if we have a method for findById in Extended or Generated.
      // Generated ClientsService has findById.
      const { ClientsService } = await import("@/services/generated/ClientsService");
      const client = await ClientsService.findById(segment);
      if (client) {
        // Return company name or first name + last name
        return client.company_name || `${client.first_name} ${client.last_name}`.trim() || "Client";
      }
    } else if (type === "rfp") {
      const project = await ProjectRequestsService.findById(segment);
      if (project) {
        return project.project_title || "Project";
      }
    }
  } catch (error) {
    console.error(`Failed to resolve breadcrumb label for ${segment} (${type}):`, error);
    return null;
  }

  return null;
}
