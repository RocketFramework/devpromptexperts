import Link from "next/link";
import { useState } from "react";
import { ConsultantDTO as Consultant } from "@/types/dtos/Consultant.dto";
import { HiStar, HiMapPin, HiBriefcase, HiCheckBadge } from "react-icons/hi2";

interface SearchConsultantListCardProps {
    consultant: Consultant;
}

export default function SearchConsultantListCard({
    consultant,
}: SearchConsultantListCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const showImage = consultant.image && !imageError;

    return (
        <Link
            href={`/findconsultants/${consultant.user_id}`}
            className="group relative flex flex-col md:flex-row bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 p-6 gap-6 items-start"
        >
            {/* Hover Sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Left: Avatar & Identity */}
            <div className="flex-shrink-0 relative z-10 flex md:flex-col items-center gap-4 text-center md:w-32">
                <div className="relative">
                    {showImage ? (
                        <img
                            src={consultant.image ?? ""}
                            alt={consultant.name}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm ring-1 ring-slate-100 ${imageLoaded ? "opacity-100" : "opacity-0"
                                } transition-opacity duration-300`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-2xl ring-1 ring-slate-100">
                            {consultant.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                        </div>
                    )}
                    {/* Featured Badge (Mini) */}
                    {consultant.featured && (
                        <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm ring-2 ring-white">
                            Featured
                        </div>
                    )}
                </div>

                <div className="md:hidden text-left">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {consultant.name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm">
                        {consultant.title || "AI Consultant"}
                    </p>
                </div>
            </div>

            {/* Middle: Details & Bio */}
            <div className="flex-1 min-w-0 relative z-10 border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 w-full">
                <div className="hidden md:flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                            {consultant.name}
                            <HiCheckBadge className="text-blue-500 w-5 h-5" title="Verified Expert" />
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">
                            {consultant.title || "AI Consultant"}
                        </p>
                    </div>
                    {/* Meta Row Desktop */}
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
                            <HiStar className="w-4 h-4" />
                            <span>{consultant.rating?.toFixed(1) || "5.0"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiBriefcase className="w-4 h-4 text-slate-400" />
                            <span>{consultant.work_experience ? `${consultant.work_experience}y Exp` : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {consultant.bioSummary ||
                        "Experienced AI specialist focused on delivering scalable solutions and optimizing prompt engineering workflows for enterprise clients. Proven track record in NLP and Machine Learning integration."}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                    {consultant.expertise?.slice(0, 3).map((exp) => (
                        <span key={exp} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-100">
                            {exp}
                        </span>
                    ))}
                    {consultant.skills?.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-500 border border-slate-200">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Right: Actions & Stats */}
            <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-6 relative z-10">
                <div className="space-y-3">
                    {consultant.country && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <HiMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{consultant.country}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{consultant.availability || "Available"}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="w-full bg-slate-900 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 group-hover:bg-blue-600 group-hover:shadow-blue-200 transition-all duration-300">
                        View Profile
                    </div>
                </div>
            </div>
        </Link>
    );
}
