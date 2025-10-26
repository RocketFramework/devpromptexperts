// app/consultants/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ConsultantBusinessService } from '@/services/business/ConsultantBusinessService';
import SearchConsultantHeader from '@/components/SearchConsultantHeader';
import SearchConsultantFilters from '@/components/SearchConsultantFilters';
import SearchConsultantGrid from '@/components/SearchConsultantGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConsultantDTO as Consultant } from '@/types/dtos/Consultant.dto';

export interface SearchFilters {
  query: string;
  expertise: string[];
  skills: string[];
  availability: string[];
  minExperience: number;
  maxExperience: number;
  minRating: number;
  country: string;
  featuredOnly: boolean;
}

export default function ConsultantSearchPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    expertise: [],
    skills: [],
    availability: [],
    minExperience: 0,
    maxExperience: 50,
    minRating: 0,
    country: '',
    featuredOnly: false,
  });

  useEffect(() => {
    loadConsultants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [consultants, filters]);

  const loadConsultants = async () => {
    try {
      setLoading(true);
      const data = await ConsultantBusinessService.getConsultantsForAdmin();
      console.log("data received and count is: %", data.length);
      setConsultants(data);
    } catch (err) {
      setError('Failed to load consultants');
      console.error('Error loading consultants:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = consultants;
    console.log("Count before filtering is: %", consultants.length);
    /*
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(consultant =>
        consultant.name?.toLowerCase().includes(query) ||
        consultant.title?.toLowerCase().includes(query) ||
        consultant.bioSummary?.toLowerCase().includes(query) ||
        consultant.expertise?.some(exp => exp.toLowerCase().includes(query)) ||
        consultant.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Expertise filter
    if (filters.expertise.length > 0) {
      filtered = filtered.filter(consultant =>
        filters.expertise.some(exp => consultant.expertise?.includes(exp))
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(consultant =>
        filters.skills.some(skill => consultant.skills?.includes(skill))
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(consultant =>
        consultant.availability && filters.availability.includes(consultant.availability)
      );
    }

    // Experience filter
    filtered = filtered.filter(consultant =>
      consultant.workExperience !== null &&
      consultant.workExperience >= filters.minExperience &&
      consultant.workExperience <= filters.maxExperience
    );

    // Rating filter
    filtered = filtered.filter(consultant =>
      consultant.rating !== null && consultant.rating >= filters.minRating
    );

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(consultant =>
        consultant.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Featured only
    if (filters.featuredOnly) {
      filtered = filtered.filter(consultant => consultant.featured);
    }*/
    console.log("Count Aftre filtering is: %", filtered.length);
    setFilteredConsultants(filtered);
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SearchConsultantHeader 
        searchQuery={filters.query}
        onSearchChange={(query) => updateFilters({ query })}
        resultCount={filteredConsultants.length}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SearchConsultantFilters
              filters={filters}
              onFiltersChange={updateFilters}
              consultants={consultants}
            />
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <SearchConsultantGrid consultants={filteredConsultants} />
          </div>
        </div>
      </div>
    </div>
  );
}