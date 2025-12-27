'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ConsultantsBusinessService } from '@/services/business/ConsultantBusinessService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserRoles } from '@/types';
import Image from 'next/image';

// Define types for the profile data
interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  profile_image_url: string | null;
  country: string | null;
  company: string | null;
  timezone: string | null;
  role: string | null;
}

interface Consultant {
  id: string;
  user_id: string;
  title: string | null;
  work_experience: number | null;
  bio_summary: string | null;
  expertise: string[] | null;
  skills: string[] | null;
  hourly_rate: number | null;
  min_project_size: number | null;
  availability: string | null;
  hours_per_week: number | null;
  notice_period: string | null;
  featured: boolean;
  linkedinUrl: string | null;
  portfolio_url: string | null;
  certifications: string[] | null;
  publications: string[] | null;
  project_types: string[] | null;
  industries: string[] | null;
  preferred_engagement_type: string[] | null;
  rating: number | null;
  projects_completed: number | null;
  founder_number: number | null;
  user: User;
}

interface Project {
  id: string;
  consultant_id: string;
  project_request_id: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  actual_duration: string | null;
  estimated_duration: string | null;
  actual_hours: number | null;
  total_hours_estimated: number | null;
}

interface ConsultantProfile {
  consultant: Consultant;
  projects: Project[];
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
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100 relative">
          {/* Subtle Top Accent */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700"></div>

          <div className="px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl border-4 border-slate-50 overflow-hidden bg-white shadow-xl transform transition-transform hover:scale-[1.02] duration-300">
                    {user?.profile_image_url ? (
                      <Image
                        src={user.profile_image_url}
                        alt={user.full_name || 'Consultant'}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 text-6xl font-bold">
                        {user?.full_name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  {consultant.featured && (
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-full border-4 border-white shadow-lg tracking-wider uppercase">
                      Featured
                    </div>
                  )}
                </div>

                {/* Name & Title Section */}
                <div className="pt-2 flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div>
                      <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{user?.full_name}</h1>
                        {consultant.founder_number && (
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                            #{consultant.founder_number}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl text-indigo-600 font-semibold mb-6 tracking-tight">{consultant.title}</p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-y-3 gap-x-6 text-sm text-slate-500 font-medium">
                        {user?.country && (
                          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {user.country}
                          </div>
                        )}
                        {consultant.hourly_rate && (
                          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${consultant.hourly_rate}/hr
                          </div>
                        )}
                        {consultant.availability && (
                          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {consultant.availability}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                      <button className="flex-1 lg:flex-none px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] flex items-center justify-center active:scale-95">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Consultant
                      </button>
                      {consultant.linkedinUrl && (
                        <a
                          href={consultant.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center active:scale-95"
                        >
                          <svg className="w-5 h-5 mr-2 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-100">
              <div className="group flex items-center space-x-5 p-6 rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-4 bg-indigo-100 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Experience</p>
                  <p className="text-2xl font-black text-slate-900">{consultant.work_experience || 0} <span className="text-lg font-medium text-slate-400">Years</span></p>
                </div>
              </div>

              <div className="group flex items-center space-x-5 p-6 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Projects</p>
                  <p className="text-2xl font-black text-slate-900">{consultant.projects_completed || 0} <span className="text-lg font-medium text-slate-400">Done</span></p>
                </div>
              </div>

              <div className="group flex items-center space-x-5 p-6 rounded-2xl bg-slate-50 border border-transparent hover:border-amber-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-4 bg-amber-100 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Rating</p>
                  <p className="text-2xl font-black text-slate-900">{consultant.rating || 'New'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {(consultant.bio_summary || (consultant.certifications && consultant.certifications.length > 0) || (consultant.publications && consultant.publications.length > 0)) && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-slate-100">
            {consultant.bio_summary && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  About
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{consultant.bio_summary}</p>
              </div>
            )}

            {/* Certifications & Publications */}
            {((consultant.certifications && consultant.certifications.length > 0) || (consultant.publications && consultant.publications.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                {consultant.certifications && consultant.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Certifications</h3>
                    <ul className="space-y-4">
                      {consultant.certifications.map((cert: string, idx: number) => (
                        <li key={idx} className="flex items-start group">
                          <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium leading-snug">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {consultant.publications && consultant.publications.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Publications</h3>
                    <ul className="space-y-4">
                      {consultant.publications.map((pub: string, idx: number) => (
                        <li key={idx} className="flex items-start group">
                          <div className="w-6 h-6 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium leading-snug">{pub}</span>
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
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {consultant.expertise?.map((item: string, index: number) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100 hover:bg-blue-100 transition-colors cursor-default">
                  {item}
                </span>
              )) || <span className="text-slate-400 italic">No expertise listed</span>}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {consultant.skills?.map((item: string, index: number) => (
                <span key={index} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                  {item}
                </span>
              )) || <span className="text-slate-400 italic">No skills listed</span>}
            </div>
          </div>
        </div>

        {/* Supported User Stories (Project Types) */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
            <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-3 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            Supported User Stories
          </h3>
          <p className="text-slate-400 text-sm mb-8 ml-11">Types of projects and engagements this consultant specializes in.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultant.project_types?.map((type: string, index: number) => (
              <div key={index} className="group flex items-center p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all duration-300">
                <div className="w-8 h-8 bg-white text-indigo-500 rounded-lg shadow-sm flex items-center justify-center mr-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-700 font-semibold">{type}</span>
              </div>
            )) || <div className="text-slate-400 italic col-span-full py-4 text-center">No specific project types listed</div>}
          </div>
        </div>

        {/* Previous Projects */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Previous Projects</h2>
            <div className="h-px flex-1 bg-slate-100 mx-8 hidden md:block"></div>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-8">
              {projects.map((project: Project) => (
                <div key={project.id} className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {project.project_request_id ? 'Project Request #' + project.project_request_id.slice(0, 8) : 'Project'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 font-medium">
                          <span className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(project.start_date).toLocaleDateString()}
                          </span>
                          {project.end_date && (
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              {new Date(project.end_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${project.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-6 border-t border-slate-50">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Duration</span>
                      <span className="font-bold text-slate-900">{project.actual_duration || project.estimated_duration || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Total Hours</span>
                      <span className="font-bold text-slate-900">{project.actual_hours || project.total_hours_estimated || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-20 text-center border border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">This consultant hasn&#39;t completed any projects on the platform yet.</p>
            </div>
          )}
        </div>

        {/* Additional Details Section */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Industries */}
            {consultant.industries && consultant.industries.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Industries</h4>
                <div className="flex flex-wrap gap-3">
                  {consultant.industries.map((industry: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold border border-slate-100">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Details */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Availability Details</h4>
              <ul className="space-y-4">
                {consultant.hours_per_week && (
                  <li className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Hours per week</span>
                    <span className="font-bold text-slate-900 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm">{consultant.hours_per_week} hrs</span>
                  </li>
                )}
                {consultant.notice_period && (
                  <li className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Notice Period</span>
                    <span className="font-bold text-slate-900 capitalize">{consultant.notice_period}</span>
                  </li>
                )}
                {consultant.min_project_size && (
                  <li className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Min Project Size</span>
                    <span className="font-bold text-slate-900">${consultant.min_project_size.toLocaleString()}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Engagement Preferences */}
            {consultant.preferred_engagement_type && consultant.preferred_engagement_type.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Engagement Preferences</h4>
                <div className="flex flex-wrap gap-3">
                  {consultant.preferred_engagement_type.map((type: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Link */}
            {consultant.portfolio_url && (
              <div className="col-span-full pt-8 border-t border-slate-100 mt-4">
                <a
                  href={consultant.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <svg className="w-5 h-5 mr-3 text-indigo-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
