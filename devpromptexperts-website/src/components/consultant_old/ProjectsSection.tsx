// components/dashboard/ProjectsSection.tsx
'use client';
import { Project } from "@/types/interfaces";
import { useState } from 'react';

interface ProjectsSectionProps {
  completedProjects: Project[];
  upcomingProjects: Project[];
}

export default function ProjectsSection({ 
  completedProjects, 
  upcomingProjects 
}: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  // Use the props instead of mock data
  const projects = {
    upcoming: upcomingProjects,
    completed: completedProjects
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      upcoming: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'upcoming' && '⏳ Upcoming'}
        {status === 'completed' && '✅ Completed'}
        {status === 'in-progress' && '🔄 In Progress'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-gray-600 mt-1">Manage your current and upcoming work</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming ({projects.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({projects.completed.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects[activeTab].map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {project.title.split(' ').map(word => word[0]).join('').toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{project.client_name}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <StatusBadge status={project.status} />
                  <span className="text-sm text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${project.project_value.toLocaleString()}</p>
              <div className="flex items-center space-x-2 mt-1">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
                {activeTab === 'upcoming' && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Start Project
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects[activeTab].length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} projects</h4>
          <p className="text-gray-500 mb-4">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming projects. Complete your profile to get more visibility."
              : "You haven't completed any projects yet."
            }
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Available Projects
          </button>
        </div>
      )}
    </div>
  );
}