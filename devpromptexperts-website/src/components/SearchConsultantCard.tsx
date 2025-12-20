// components/consultants/SearchConsultantCard.tsx
import { ConsultantDTO as Consultant } from "@/types/dtos/Consultant.dto";
import { CountryToFlag as countryToFlag } from "@/types/dtos/CountryToFlag.dto";
import Link from "next/link";
import { useState } from "react";

interface SearchConsultantCardProps {
  consultant: Consultant;
}

export default function SearchConsultantCard({
  consultant,
}: SearchConsultantCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const showTooltip = (content: string, event: React.MouseEvent) => {
    setTooltip({
      show: true,
      content,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 });
  };

  // Function to shorten availability text
  const shortenAvailability = (availability: string): string => {
    if (!availability) return availability;

    return availability
      .replace(/hours\/week/gi, 'hrs/wk')
      .replace(/hour\/week/gi, 'hr/wk')
      .replace(/hours/gi, 'hrs')
      .replace(/hour/gi, 'hr')
      .replace(/week/gi, 'wk')
      .replace(/\/week/gi, '/wk');
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Show image if it exists and hasn't errored, otherwise show initials
  const showImage = consultant.image && !imageError;
  const showInitials = !consultant.image || imageError;
  const countryFlag = countryToFlag(consultant.country);

  return (
    <Link
      href={`/findconsultants/${consultant.user_id}`}
      className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 group cursor-pointer"
    >
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm max-w-xs break-words"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
          }}
        >
          {tooltip.content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-gray-50 bg-white group-hover:bg-blue-50/30 transition-colors">
        <div className="flex items-center space-x-4 min-w-0">
          {/* Image/Initials with Country Flag */}
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

            {/* Country Flag Badge */}
            {(consultant.country || countryFlag !== "🏴") && (
              <div
                className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-[10px]"
              >
                {countryFlag}
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
            {consultant.featured && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full mt-1.5 uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 flex-1 flex flex-col">
        {/* Bio Summary - Limited to 2 lines for summary tile */}
        {consultant.bioSummary && (
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {consultant.bioSummary}
          </p>
        )}

        {/* Rating and Experience - Compact */}
        <div className="flex items-center justify-between text-[11px] py-2 border-y border-gray-50">
          {renderStars(consultant.rating)}
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

        {/* Skills - Compact Tags */}
        {consultant.skills && consultant.skills.length > 0 && (
          <div className="mt-auto pt-2">
            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-md border border-emerald-100/50 truncate max-w-[100px]"
                >
                  {skill}
                </span>
              ))}
              {consultant.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-medium rounded-md border border-gray-100">
                  +{consultant.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
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
