// components/consultants/SearchConsultantCard.tsx
import { ConsultantDTO as Consultant } from "@/types/dtos/Consultant.dto";
import Link from "next/link";
import { useState } from "react";
import { HiStar, HiMapPin, HiBriefcase } from "react-icons/hi2";

interface SearchConsultantCardProps {
  consultant: Consultant;
}

export default function SearchConsultantCard({
  consultant,
}: SearchConsultantCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showImage = consultant.image && !imageError;
  const showInitials = !showImage;

  return (
    <Link
      href={`/findconsultants/${consultant.user_id}`}
      className="group relative flex flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
    >
      {/* 
        Hover gradient sheen effect 
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Header: Avatar & Key Info */}
      <div className="p-8 pb-4 flex items-start gap-5 relative z-10">
        <div className="relative shrink-0">
          {showImage ? (
            <img
              src={consultant.image ?? ""}
              alt={consultant.name}
              className={`w-16 h-16 rounded-2xl object-cover shadow-sm ring-1 ring-slate-100 ${imageLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xl ring-1 ring-slate-100">
              {consultant.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </div>
          )}
          {/* Featured Badge */}
          {consultant.featured && (
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm ring-2 ring-white">
              Featured
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-lg font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-blue-600 font-medium text-sm truncate mt-0.5 mb-2">
            {consultant.title || "AI Consultant"}
          </p>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
              <HiStar className="w-3.5 h-3.5" />
              <span>{consultant.rating?.toFixed(1) || "5.0"}</span>
            </div>
            {consultant.country && (
              <div className="flex items-center gap-1 truncate max-w-[120px]">
                <HiMapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{consultant.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-8 py-2 flex-1 flex flex-col relative z-10">

        {/* Bio */}
        <div className="mb-6">
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {consultant.bioSummary ||
              "Experienced AI specialist focused on delivering scalable solutions and optimizing prompt engineering workflows for enterprise clients."}
          </p>
        </div>

        {/* Tags Section */}
        <div className="mt-auto space-y-3">
          {/* Expertise */}
          {consultant.expertise && consultant.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {consultant.expertise.slice(0, 2).map((exp) => (
                <span
                  key={exp}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/50 group-hover:text-blue-700 transition-colors duration-300"
                >
                  {exp}
                </span>
              ))}
              {consultant.expertise.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-100">
                  +{consultant.expertise.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Skills (Unique to Search Page) */}
          {consultant.skills && consultant.skills.length > 0 && (
            <div className="pt-3 border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {consultant.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {skill}
                  </span>
                ))}
                {consultant.skills.length > 3 && (
                  <span className="text-xs text-slate-400 font-medium px-1">
                    +{consultant.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Metrics & Action */}
      <div className="px-8 pb-8 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10 mt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Project Exp</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
            <HiBriefcase className="w-4 h-4 text-slate-400" />
            {consultant.projectsCompleted || 0} Finished
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
