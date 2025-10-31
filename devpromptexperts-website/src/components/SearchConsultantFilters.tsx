// components/consultants/ConsultantFilters.tsx
import { SearchFilters } from '@/app/findconsultants/page';
import { ExpertiseOptions as AI_EXPERTISE } from '@/types/types';
import { AiSkills as AI_SKILLS } from '@/types/types';
import { Availability as AVAILABILITY_OPTIONS} from '@/types/types';
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Expertise Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          AI Expertise
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {AI_EXPERTISE.map(expertise => (
            <label key={expertise} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.expertise.includes(expertise)}
                onChange={(e) => {
                  const newExpertise = e.target.checked
                    ? [...filters.expertise, expertise]
                    : filters.expertise.filter(exp => exp !== expertise);
                  onFiltersChange({ expertise: newExpertise });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Technical Skills
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {AI_SKILLS.map(skill => (
            <label key={skill} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.skills.includes(skill)}
                onChange={(e) => {
                  const newSkills = e.target.checked
                    ? [...filters.skills, skill]
                    : filters.skills.filter(s => s !== skill);
                  onFiltersChange({ skills: newSkills });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Availability
        </label>
        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map(availability => (
            <label key={availability} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.availability.includes(availability)}
                onChange={(e) => {
                  const newAvailability = e.target.checked
                    ? [...filters.availability, availability]
                    : filters.availability.filter(a => a !== availability);
                  onFiltersChange({ availability: newAvailability });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{availability}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Experience: {filters.minExperience} - {filters.maxExperience} years
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="50"
            value={filters.minExperience}
            onChange={(e) => onFiltersChange({ minExperience: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="50"
            value={filters.maxExperience}
            onChange={(e) => onFiltersChange({ maxExperience: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum Rating: {filters.minRating}+
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => onFiltersChange({ minRating: rating })}
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                filters.minRating === rating
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={filters.country}
          onChange={(e) => onFiltersChange({ country: e.target.value })}
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country??"No Country"}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Only */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => onFiltersChange({ featuredOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
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
        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Reset All Filters
      </button>
    </div>
  );
}