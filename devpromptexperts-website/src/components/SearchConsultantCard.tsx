// components/consultants/SearchConsultantCard.tsx
import { ConsultantDTO as Consultant } from '@/types/dtos/Consultant.dto'

interface SearchConsultantCardProps {
  consultant: Consultant;
}

export default function SearchConsultantCard({ consultant }: SearchConsultantCardProps) {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {consultant.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {consultant.name}
              </h3>
              <p className="text-blue-600 font-medium">{consultant.title}</p>
              {consultant.featured && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-1">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Bio Summary */}
        {consultant.bioSummary && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {consultant.bioSummary}
          </p>
        )}

        {/* Rating and Experience */}
        <div className="flex items-center justify-between text-sm">
          {renderStars(consultant.rating)}
          {consultant.workExperience && (
            <span className="text-gray-600">
              {consultant.workExperience}+ years
            </span>
          )}
        </div>

        {/* Expertise */}
        {consultant.expertise && consultant.expertise.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Expertise
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.expertise.slice(0, 3).map(exp => (
                <span
                  key={exp}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {exp}
                </span>
              ))}
              {consultant.expertise.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{consultant.expertise.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {consultant.skills && consultant.skills.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 4).map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
          {consultant.projectsCompleted && (
            <span>{consultant.projectsCompleted} projects</span>
          )}
          {consultant.availability && (
            <span className="capitalize">{consultant.availability}</span>
          )}
          {consultant.country && (
            <span>{consultant.country}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Contact Expert
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}