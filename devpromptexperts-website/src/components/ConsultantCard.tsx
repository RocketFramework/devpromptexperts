import React, { useState } from "react";
import Link from "next/link";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";

export default function ConsultantCard({
  consultant,
}: {
  consultant: ConsultantDTO;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showImage = consultant.image && !imageError;
  const showInitials = !showImage;

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-amber-400 text-xs">★</span>
        <span className="text-[11px] font-bold text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Link
      href={`/findconsultants/${consultant.user_id}`}
      className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 group cursor-pointer"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-50 bg-white group-hover:bg-blue-50/30 transition-colors">
        <div className="flex items-center space-x-4 min-w-0">
          {/* Image/Initials */}
          <div className="relative flex-shrink-0">
            {showImage && (
              <img
                src={consultant.image ?? ""}
                alt={consultant.name}
                className={`w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100 ${imageLoaded ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-200`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            {showInitials && (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base">
                {consultant.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 truncate tracking-tight group-hover:text-blue-600 transition-colors">
              {consultant.name}
            </h3>
            <p className="text-blue-600 font-semibold truncate text-xs mt-0.5">
              {consultant.title}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 flex-1 flex flex-col">
        {/* Rating and Experience - Compact */}
        <div className="flex items-center justify-between text-[11px] py-2 border-y border-gray-50">
          {renderStars(consultant.rating ?? 0)}
          {consultant.work_experience && (
            <span className="text-gray-500 font-bold uppercase tracking-wider">
              {consultant.work_experience}+ Yrs Exp
            </span>
          )}
        </div>

        {/* Expertise - Compact Tags */}
        {consultant.expertise && consultant.expertise.length > 0 && (
          <div>
            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Expertise
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.expertise.slice(0, 2).map((exp) => (
                <span
                  key={exp}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-md border border-blue-100/50 truncate max-w-[120px]"
                >
                  {exp}
                </span>
              ))}
              {consultant.expertise.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-medium rounded-md border border-gray-100">
                  +{consultant.expertise.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto pt-2 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>{consultant.projectsCompleted} Projects</span>
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {consultant.availability}
          </span>
        </div>
      </div>

      {/* Footer - Subtle indicator */}
      <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex justify-center items-center group-hover:bg-blue-50 transition-colors">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
          View Profile
        </span>
      </div>
    </Link>
  );
}
