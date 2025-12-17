'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ConsultantsBusinessService } from '@/services/business/ConsultantBusinessService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserRoles } from '@/types';
import Image from 'next/image';

// Define types for the profile data
interface ConsultantProfile {
  consultant: any; // We'll refine this type
  projects: any[];
}

export default function ConsultantProfilePage() {
  const params = useParams();
  const consultantId = params.consultant_id as string;
  
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!consultantId) return;
      
      try {
        setLoading(true);
        const data = await ConsultantsBusinessService.getConsultantPublicProfile(consultantId);
        
        if (!data) {
          setError('Consultant not found');
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error loading consultant profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [consultantId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Consultant not found'}</div>;

  const { consultant, projects } = profile;
  const { user } = consultant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col md:flex-row items-start gap-6 w-full">
                {/* Image */}
                <div className="relative -mt-20 z-10 flex-shrink-0">
                  <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                    {user?.profile_image_url ? (
                      <Image 
                        src={user.profile_image_url} 
                        alt={user.full_name || 'Consultant'} 
                        width={160} 
                        height={160} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-5xl font-bold">
                        {user?.full_name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  {consultant.featured && (
                    <div className="absolute bottom-2 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Name & Title Section */}
                <div className="pt-4 md:pt-6 flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.full_name}</h1>
                      <p className="text-xl text-blue-600 font-medium mb-3">{consultant.title}</p>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                        {user?.country && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {user.country}
                          </div>
                        )}
                        {consultant.hourly_rate && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${consultant.hourly_rate}/hr
                          </div>
                        )}
                        {consultant.availability && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {consultant.availability}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Consultant
                      </button>
                      {consultant.linkedinUrl && (
                        <a 
                          href={consultant.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Experience</p>
                  <p className="text-lg font-bold text-gray-900">{consultant.work_experience || 0} Years</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Projects Completed</p>
                  <p className="text-lg font-bold text-gray-900">{consultant.projectsCompleted || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Rating</p>
                  <p className="text-lg font-bold text-gray-900">{consultant.rating || 'New'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {(consultant.bio_summary || consultant.certifications?.length > 0 || consultant.publications?.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {consultant.bio_summary && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed">{consultant.bio_summary}</p>
              </div>
            )}

            {/* Certifications & Publications */}
            {(consultant.certifications?.length > 0 || consultant.publications?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                {consultant.certifications?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Certifications</h3>
                    <ul className="space-y-3">
                      {consultant.certifications.map((cert: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="leading-snug">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {consultant.publications?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Publications</h3>
                    <ul className="space-y-3">
                      {consultant.publications.map((pub: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="leading-snug">{pub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skills & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {consultant.expertise?.map((item: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {item}
                </span>
              )) || <span className="text-gray-500 italic">No expertise listed</span>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {consultant.skills?.map((item: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {item}
                </span>
              )) || <span className="text-gray-500 italic">No skills listed</span>}
            </div>
          </div>
        </div>

        {/* Supported User Stories (Project Types) */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Supported User Stories</h3>
          <p className="text-gray-500 text-sm mb-4">Types of projects and engagements this consultant specializes in.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultant.project_types?.map((type: string, index: number) => (
              <div key={index} className="flex items-start p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 font-medium">{type}</span>
              </div>
            )) || <div className="text-gray-500 italic col-span-full">No specific project types listed</div>}
          </div>
        </div>

        {/* Previous Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Previous Projects</h2>
          {projects.length > 0 ? (
            <div className="grid gap-6">
              {projects.map((project: any) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {project.project_request_id ? 'Project Request #' + project.project_request_id.slice(0, 8) : 'Project'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                        {project.end_date && <span>Ended: {new Date(project.end_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-gray-50">
                    <div>
                      <span className="block text-xs text-gray-500 uppercase">Duration</span>
                      <span className="font-medium text-gray-900">{project.actual_duration || project.estimated_duration || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 uppercase">Total Hours</span>
                      <span className="font-medium text-gray-900">{project.actual_hours || project.total_hours_estimated || 'N/A'}</span>
                    </div>
                    {/* Hide financial details for public view unless explicitly requested, keeping it safe for now */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
              <p className="text-gray-500">This consultant hasn't completed any projects on the platform yet.</p>
            </div>
          )}
        </div>

        {/* Additional Details Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Industries */}
            {consultant.industries && consultant.industries.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {consultant.industries.map((industry: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Availability Details</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {consultant.hours_per_week && (
                  <li className="flex justify-between">
                    <span className="text-gray-500">Hours per week:</span>
                    <span className="font-medium">{consultant.hours_per_week} hrs</span>
                  </li>
                )}
                {consultant.notice_period && (
                  <li className="flex justify-between">
                    <span className="text-gray-500">Notice Period:</span>
                    <span className="font-medium capitalize">{consultant.notice_period}</span>
                  </li>
                )}
                {consultant.min_project_size && (
                  <li className="flex justify-between">
                    <span className="text-gray-500">Min Project Size:</span>
                    <span className="font-medium">${consultant.min_project_size.toLocaleString()}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Engagement Preferences */}
            {consultant.preferred_engagement_type && consultant.preferred_engagement_type.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Engagement Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {consultant.preferred_engagement_type.map((type: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 border border-blue-200 text-blue-700 rounded text-sm capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Link */}
            {consultant.portfolio_url && (
              <div className="col-span-full pt-4 border-t border-gray-100 mt-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Portfolio</h4>
                <a 
                  href={consultant.portfolio_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Portfolio / Website
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
