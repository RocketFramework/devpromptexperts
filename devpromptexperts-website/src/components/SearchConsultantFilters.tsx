// components/consultants/ConsultantFilters.tsx
import { SearchFilters } from '@/app/findconsultants/page';
import { ExpertiseOptions as AI_EXPERTISE, Availabilities as AVAILABILITY_OPTIONS } from '@/types/';
import { AiSkills as AI_SKILLS } from '@/types/';
import { ConsultantDTO as Consultant } from '@/types/dtos/Consultant.dto';

interface SearchConsultantFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  consultants: Consultant[];
}

export default function SearchConsultantFilters({
  filters,
  onFiltersChange,
  consultants,
}: SearchConsultantFiltersProps) {
  const uniqueCountries = Array.from(
    new Set(consultants.map(c => c.country).filter(Boolean))
  ).sort();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Expertise Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
          AI Expertise
        </label>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {AI_EXPERTISE.map(expertise => (
            <label key={expertise} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.expertise.includes(expertise)}
                onChange={(e) => {
                  const newExpertise = e.target.checked
                    ? [...filters.expertise, expertise]
                    : filters.expertise.filter(exp => exp !== expertise);
                  onFiltersChange({ expertise: newExpertise });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-normal">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
          Technical Skills
        </label>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {AI_SKILLS.map(skill => (
            <label key={skill} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.skills.includes(skill)}
                onChange={(e) => {
                  const newSkills = e.target.checked
                    ? [...filters.skills, skill]
                    : filters.skills.filter(s => s !== skill);
                  onFiltersChange({ skills: newSkills });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-normal">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
          Availability
        </label>
        <div className="space-y-3">
          {AVAILABILITY_OPTIONS.map(availability => (
            <label key={availability} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes(availability)}
                onChange={(e) => {
                  const newAvailability = e.target.checked
                    ? [...filters.availability, availability]
                    : filters.availability.filter(a => a !== availability);
                  onFiltersChange({ availability: newAvailability });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-normal">{availability}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Range */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Experience
          </label>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {filters.minExperience}-{filters.maxExperience} yrs
          </span>
        </div>
        <div className="space-y-6">
          <input
            type="range"
            min="0"
            max="50"
            value={filters.minExperience}
            onChange={(e) => onFiltersChange({ minExperience: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="range"
            min="0"
            max="50"
            value={filters.maxExperience}
            onChange={(e) => onFiltersChange({ maxExperience: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => onFiltersChange({ minRating: rating })}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all border ${filters.minRating === rating
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Country
        </label>
        <select
          value={filters.country}
          onChange={(e) => onFiltersChange({ country: e.target.value })}
          className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 transition-all py-2.5"
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country ?? "No Country"}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Only */}
      <div className="pt-6 border-t border-gray-100">
        <label className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => onFiltersChange({ featuredOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
          />
          <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            Featured Experts Only
          </span>
        </label>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => onFiltersChange({
          query: '',
          expertise: [],
          skills: [],
          availability: [],
          minExperience: 0,
          maxExperience: 50,
          minRating: 0,
          country: '',
          featuredOnly: false,
        })}
        className="w-full py-3 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        Reset All Filters
      </button>
    </div>
  );
}