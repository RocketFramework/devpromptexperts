import ProjectsIntelligence from '@/components/consultant/ProjectsIntelligence';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';
import { ExtendedProjectsService, type Project } from '@/services/extended/ExtendedProjectsService';

import Link from 'next/link';

export default async function ProjectsPage({ params }: { params: Promise<{ consultant_id: string }> }) {
  const { consultant_id } = await params;
  const scenario: ScenarioType = 'balancedPortfolio';
  const dashboardData = getSampleData(scenario, 'current_consultant');

  const activeProjects = await ExtendedProjectsService.findByConsultantId(consultant_id, 'active');
  const completedProjects = await ExtendedProjectsService.findByConsultantId(consultant_id, 'completed');

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProjectsIntelligence {...dashboardData} />

        <ProjectTable
          title="Active Projects"
          projects={activeProjects}
          consultantId={consultant_id}
          emptyMessage="No active projects found."
        />

        <ProjectTable
          title="Completed Projects"
          projects={completedProjects}
          consultantId={consultant_id}
          emptyMessage="No completed projects found."
        />
      </div>
    </div>
  );
}

function ProjectTable({
  title,
  projects,
  consultantId,
  emptyMessage
}: {
  title: string;
  projects: Project[];
  consultantId: string;
  emptyMessage: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-medium text-gray-500 text-sm">Project Name</th>
                <th className="py-3 font-medium text-gray-500 text-sm">Client</th>
                <th className="py-3 font-medium text-gray-500 text-sm">Start Date</th>
                <th className="py-3 font-medium text-gray-500 text-sm">End Date</th>
                <th className="py-3 font-medium text-gray-500 text-sm">Contract Value</th>
                <th className="py-3 font-medium text-gray-500 text-sm">Status</th>
                <th className="py-3 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project: Project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{project.project_requests?.title || 'Untitled Project'}</div>
                    <div className="text-sm text-gray-400 line-clamp-1">{project.project_requests?.project_summary}</div>
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{project.clients?.company_name || 'Unknown Client'}</div>
                    <div className="text-sm text-gray-400">
                      {[project.clients?.city, project.clients?.country].filter(Boolean).join(', ')}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 font-medium text-gray-900">
                    ${project.contract_value?.toLocaleString() || '0'}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/consultant/${consultantId}/projects/${project.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}