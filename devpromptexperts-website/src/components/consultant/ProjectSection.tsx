// components/dashboard/ProjectsSection.tsx
"use client";

import { useState } from "react";
import type { Project } from "@/types/interfaces";

interface ProjectsSectionProps {
  completedProjects: Project[];
  upcomingProjects: Project[];
}

export default function ProjectsSection({
  completedProjects,
  upcomingProjects,
}: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );

  // Use actual props data
  const projects = {
    upcoming: upcomingProjects,
    completed: completedProjects,
  };

  type PaymentStatus = "paid" | "processing" | "pending";

  const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
    const styles: Record<PaymentStatus, string> = {
      paid: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    };

    const labels: Record<PaymentStatus, string> = {
      paid: "Paid",
      processing: "Processing",
      pending: "Pending",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const EarningsBreakdown = ({ project }: { project: Project }) => (
    <div className="text-sm text-gray-600 space-y-1">
      <div className="flex justify-between">
        <span>Project Value:</span>
        <span className="font-medium">
          ${project.project_value.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Platform Commission (20%):</span>
        <span className="text-red-600">
          -${project.platform_commission.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-1">
        <span className="font-medium">Your Earnings:</span>
        <span className="font-bold text-green-600">
          ${project.your_earnings.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Projects & Earnings
          </h3>
          <p className="text-gray-600 mt-1">
            Manage your projects and track earnings
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming ({projects.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({projects.completed.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects[activeTab].map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {project.title
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-600">{project.client_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                      {activeTab === "completed" && (
                        <PaymentStatusBadge status={project.payment_status} />
                      )}
                    </div>
                  </div>
                </div>

                {activeTab === "completed" && (
                  <EarningsBreakdown project={project} />
                )}
              </div>

              {activeTab === "completed" && (
                <div className="text-right">
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-green-600">
                      ${project.your_earnings.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Your earnings</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects[activeTab].length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} projects
          </h4>
          <p className="text-gray-500">
            {activeTab === "upcoming"
              ? "You don't have any upcoming projects. Complete your profile to get more visibility."
              : "You haven't completed any projects yet."}
          </p>
        </div>
      )}
    </div>
  );
}