// services/business/ConsultantBusinessService.ts
import { ConsultantsService } from "@/services/generated/ConsultantsService";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";

export interface PaginatedConsultantsResponse {
  consultants: ConsultantDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  expertise?: string[];
  skills?: string[];
  availability?: string[];
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  country?: string;
  featuredOnly?: boolean;
  sortBy?: "default" | "projects_completed" | "work_experience" | "rating";
}

export class ConsultantsBusinessService {
  static async getConsultantsPaginated(
    searchParams: SearchParams = {}
  ): Promise<PaginatedConsultantsResponse> {
    const {
      page = 1,
      limit = 9,
      query = "",
      expertise = [],
      skills = [],
      availability = [],
      minExperience = 0,
      maxExperience = 50,
      minRating = 0,
      country = "",
      featuredOnly = false,
      sortBy = "default",
    } = searchParams;

    // Convert frontend params to backend format
    const backendParams = {
      page,
      limit,
      search: query,
      expertise: expertise.length > 0 ? expertise : undefined,
      skills: skills.length > 0 ? skills : undefined,
      availability: availability.length > 0 ? availability : undefined,
      min_experience: minExperience,
      max_experience: maxExperience,
      min_rating: minRating,
      country: country || undefined,
      featured_only: featuredOnly,
      sort_by: sortBy === "default" ? undefined : sortBy,
    };

    // Call the backend service
    const { data, total_count, current_page, total_pages } =
      await ExtendedConsultantsService.findPaginatedWithFilters(backendParams);

    // Map the data to include user information
    const mappedConsultants = data.map((consultant) => {
      const user = Array.isArray(consultant.users)
        ? consultant.users[0]
        : consultant.users;

      return {
        ...consultant,
        email: user?.email || "",
        name: user?.full_name || "",
        role: user?.role || "",
        image: user?.profile_image_url || null,
        country: user?.country || null,
      };
    });

    return {
      consultants: mappedConsultants,
      totalCount: total_count,
      currentPage: current_page,
      totalPages: total_pages,
      hasNextPage: current_page < total_pages,
      hasPrevPage: current_page > 1,
    };
  }

  static async getConsultantsForAdmin(): Promise<ConsultantDTO[]> {
    const consultants = await ConsultantsService.findAllWithUsers();

    const mappedConsultants = consultants.map((consultant) => {
      // Get the first user (there should be one user per consultant)
      const user = Array.isArray(consultant.users)
        ? consultant.users[0]
        : consultant.users;

      return {
        ...consultant,
        email: user?.email || "",
        name: user?.full_name || "",
        role: user?.role || "",
        image: user?.profile_image_url || null,
        country: user?.country || null,
      };
    });

    return mappedConsultants;
  }
}
