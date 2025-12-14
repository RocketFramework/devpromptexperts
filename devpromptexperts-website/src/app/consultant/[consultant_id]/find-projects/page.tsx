"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ExtendedProjectRequestsService } from "@/services/extended/ExtendedProjectRequestsService";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import {
  HiCurrencyDollar,
  HiClock,
  HiLightningBolt,
  HiCheckCircle,
  HiSearch,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { ProjectRequests, Consultants } from "@/services/generated";

type ProjectWithMatch = ProjectRequests & {
  response_count: number;
  matchScore: number;
  matchReasons: string[];
};

export default function FindProjectsPage() {
  const params = useParams();
  // const router = useRouter(); // Removed unused router
  const consultantId = params.consultant_id as string;
  const [projects, setProjects] = useState<ProjectWithMatch[]>([]);
  // const [consultant, setConsultant] = useState<Consultants | null>(null); // Removed unused consultant state
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, matched

  useEffect(() => {
    if (consultantId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch Projects (Critical)
      let projectsData: (ProjectRequests & { response_count: number })[] = [];
      try {
        projectsData = await ExtendedProjectRequestsService.findAllOpenWithCounts();
      } catch (err) {
        console.error("Error loading projects:", err);
      }

      // 2. Fetch Consultant (Optional for display, needed for matching)
      let consultantData = null;
      try {
        consultantData = await ExtendedConsultantsService.findByUser_Id(consultantId);
      } catch (err) {
        console.warn("Error loading consultant profile (might not exist):", err);
      }

      // Calculate match scores
      const scoredProjects = projectsData.map((project) => {
        let score = 0;
        const reasons: string[] = [];

        // Skill Match
        if (project.required_skills && consultantData?.expertise) {
          const matchedSkills = project.required_skills.filter((skill: string) =>
            consultantData.expertise.includes(skill)
          );
          if (matchedSkills.length > 0) {
            score += matchedSkills.length * 10;
            reasons.push(`Matches ${matchedSkills.length} skills`);
          }
        }

        // Industry Match
        if (project.preferred_industries && consultantData?.industries) {
           const matchedIndustries = project.preferred_industries.filter((ind: string) =>
            consultantData.industries.includes(ind)
          );
          if (matchedIndustries.length > 0) {
            score += matchedIndustries.length * 5;
            reasons.push(`Matches industry`);
          }
        }

        return { ...project, matchScore: score, matchReasons: reasons };
      });

      // Sort by score desc, then date desc
      scoredProjects.sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        return dateB - dateA;
      });

      setProjects(scoredProjects as ProjectWithMatch[]);
      // setConsultant(consultantData);
    } catch (error) {
      console.error("Error in loadData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = filter === "matched" 
    ? projects.filter(p => p.matchScore > 0) 
    : projects;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Projects</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Browse open projects tailored to your expertise.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("matched")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === "matched"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Matched for You
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <HiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h2>
                      {project.matchScore > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <HiCheckCircle className="mr-1 h-3 w-3" />
                          {project.matchReasons[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {project.project_summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <HiCurrencyDollar className="mr-1.5 h-4 w-4" />
                        {project.budget_range}
                      </div>
                      <div className="flex items-center">
                        <HiClock className="mr-1.5 h-4 w-4" />
                        {project.timeline}
                      </div>
                      <div className="flex items-center">
                        <HiLightningBolt className="mr-1.5 h-4 w-4" />
                        {project.urgency_level}
                      </div>
                      <div className="flex items-center">
                        <HiOutlineClipboardList className="mr-1.5 h-4 w-4" />
                        {project.response_count} Responses
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end gap-3 min-w-[150px]">
                    <Link
                      href={`/consultant/${consultantId}/find-projects/${project.id}/respond`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Respond
                    </Link>
                    <span className="text-xs text-gray-400">
                      Posted {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
