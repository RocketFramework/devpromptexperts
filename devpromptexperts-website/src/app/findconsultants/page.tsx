// app/consultants/search/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConsultantsBusinessService as ConsultantBusinessService } from '@/services/business/ConsultantBusinessService';
import { PaginatedConsultantsResponse, SearchParams } from "@/types/";
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

// Sorting options
export type SortOption = 'default' | 'projects_completed' | 'work_experience' | 'rating';

export default function ConsultantSearchPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>('default');

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

  // Load consultants with backend pagination
  const loadConsultants = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);

      const searchParams: SearchParams = {
        page,
        limit: itemsPerPage,
        query: filters.query,
        expertise: filters.expertise,
        skills: filters.skills,
        availability: filters.availability,
        minExperience: filters.minExperience,
        maxExperience: filters.maxExperience,
        minRating: filters.minRating,
        country: filters.country,
        featuredOnly: filters.featuredOnly,
        sortBy: sortBy
      };

      const response: PaginatedConsultantsResponse =
        await ConsultantBusinessService.getConsultantsPaginated(searchParams);

      setConsultants(response.consultants);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);

      console.log("Data received and count is:", response.consultants.length);
      console.log("Total count:", response.totalCount);
      console.log("Sample consultant:", response.consultants[0]);

    } catch (err) {
      setError('Failed to load consultants');
      console.error('Error loading consultants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, itemsPerPage]);

  // Load data when filters, sort, or page changes
  useEffect(() => {
    loadConsultants(1); // Always start from page 1 when filters change
  }, [filters, sortBy]);

  // Load specific page
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    loadConsultants(pageNumber);
  }, [loadConsultants]);

  // Pagination functions
  const paginate = (pageNumber: number) => handlePageChange(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  // Calculate page numbers for pagination display
  // Calculate page numbers for pagination display
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Populate page numbers array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  if (loading && consultants.length === 0) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SearchConsultantHeader
        searchQuery={filters.query}
        onSearchChange={(query) => updateFilters({ query })}
        resultCount={totalCount}
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
            {/* Sorting Controls */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  {totalCount} {totalCount === 1 ? 'expert' : 'experts'}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label htmlFor="sort" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-sm font-semibold py-2 pl-3 pr-10 transition-all"
                >
                  <option value="default">Default</option>
                  <option value="projects_completed">Most Projects</option>
                  <option value="work_experience">Most Experience</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <SearchConsultantGrid consultants={consultants} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 sm:space-y-0">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Showing {((currentPage - 1) * itemsPerPage) + 1}-
                      {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} experts
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1 || loading}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${currentPage === 1 || loading
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 shadow-sm'
                          }`}
                      >
                        Prev
                      </button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {pageNumbers.map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            disabled={loading}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${currentPage === number
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 shadow-sm'
                              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages || loading}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${currentPage === totalPages || loading
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 shadow-sm'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}