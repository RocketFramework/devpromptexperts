// components/consultants/SearchConsultantCard.tsx
import { ConsultantDTO as Consultant } from '@/types/dtos/Consultant.dto'
import { CountryToFlag as countryToFlag } from '@/types/dtos/CountryToFlag.dto'
import { useState } from 'react';

interface SearchConsultantCardProps {
  consultant: Consultant;
}



export default function SearchConsultantCard({ consultant }: SearchConsultantCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const showTooltip = (content: string, event: React.MouseEvent) => {
    setTooltip({
      show: true,
      content,
      x: event.clientX,
      y: event.clientY
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

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

  // Show image if it exists and hasn't errored, otherwise show initials
  const showImage = consultant.image && !imageError;
  const showInitials = !consultant.image || imageError;
  const countryFlag = countryToFlag(consultant.country);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
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
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 min-w-0">
            {/* Country Flag positioned absolutely over the image */}
            <div className="relative">
              {/* Image with proper error handling */}
              {showImage && (
                <img 
                  src={consultant.image} 
                  alt={consultant.name}
                  className={`w-16 h-16 rounded-full object-cover shadow-sm border border-gray-200 flex-shrink-0 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } transition-opacity duration-200`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              
              {/* Initials fallback */}
              {showInitials && (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {consultant.name?.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              
              {/* Country Flag Badge */}
              {(consultant.country || countryFlag !== '🏴') && (
                <div 
                  className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-xs cursor-help"
                  title={consultant.country || 'Country not specified'}
                >
                  {countryFlag}
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              {/* Name with truncation and tooltip */}
              <h3 
                className="text-lg font-semibold text-gray-900 truncate"
                onMouseEnter={(e) => {
                  if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    showTooltip(consultant.name || '', e);
                  }
                }}
                onMouseLeave={hideTooltip}
              >
                {consultant.name}
              </h3>
              
              {/* Title with truncation and tooltip */}
              <p 
                className="text-blue-600 font-medium truncate mt-1"
                onMouseEnter={(e) => {
                  if (consultant.title && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    showTooltip(consultant.title, e);
                  }
                }}
                onMouseLeave={hideTooltip}
              >
                {consultant.title}
              </p>
              
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
        {/* Bio Summary with line clamp */}
        {consultant.bioSummary && (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {consultant.bioSummary}
          </p>
        )}

        {/* Rating and Experience */}
        <div className="flex items-center justify-between text-sm">
          {renderStars(consultant.rating)}
          {consultant.workExperience && (
            <span className="text-gray-600 whitespace-nowrap">
              {consultant.workExperience}+ years
            </span>
          )}
        </div>

        {/* Expertise with truncation */}
        {consultant.expertise && consultant.expertise.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Expertise
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.expertise.slice(0, 3).map(exp => (
                <span
                  key={exp}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full truncate max-w-[120px]"
                  title={exp}
                >
                  {exp}
                </span>
              ))}
              {consultant.expertise.length > 3 && (
                <span 
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  title={consultant.expertise.slice(3).join(', ')}
                >
                  +{consultant.expertise.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills with truncation */}
        {consultant.skills && consultant.skills.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 4).map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full truncate max-w-[100px]"
                  title={skill}
                >
                  {skill}
                </span>
              ))}
              {consultant.skills.length > 4 && (
                <span 
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  title={consultant.skills.slice(4).join(', ')}
                >
                  +{consultant.skills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats - Removed country from here since it's now in the flag */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
          {consultant.projectsCompleted && (
            <span className="whitespace-nowrap">{consultant.projectsCompleted} projects</span>
          )}
          {consultant.availability && (
            <span className="capitalize whitespace-nowrap">{consultant.availability}</span>
          )}
          {/* Country removed from stats since it's now shown as flag */}
        </div>
      </div>

      {/* Footer with compact buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-3">
          <button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
            title="Contact Expert"
          >
            Contact
          </button>
          <button 
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-3 rounded-xl text-sm font-semibold hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 whitespace-nowrap"
            title="View Full Profile"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}