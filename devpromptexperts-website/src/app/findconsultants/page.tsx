// app/consultants/search/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConsultantsBusinessService as ConsultantBusinessService, PaginatedConsultantsResponse, SearchParams } from '@/services/business/ConsultantBusinessService';
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
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
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
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {totalCount} {totalCount === 1 ? 'expert' : 'experts'} found
              </div>
              
              <div className="flex items-center space-x-4">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="projects_completed">Most Projects</option>
                  <option value="work_experience">Most Experience</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <SearchConsultantGrid consultants={consultants} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1 || loading}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === 1 || loading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {/* First Page */}
                      {startPage > 1 && (
                        <>
                          <button
                            onClick={() => paginate(1)}
                            disabled={loading}
                            className={`w-10 h-10 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300 ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            1
                          </button>
                          {startPage > 2 && (
                            <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {/* Page Numbers */}
                      {pageNumbers.map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          disabled={loading}
                          className={`w-10 h-10 rounded-lg border ${
                            currentPage === number
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {number}
                        </button>
                      ))}

                      {/* Last Page */}
                      {endPage < totalPages && (
                        <>
                          {endPage < totalPages - 1 && (
                            <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => paginate(totalPages)}
                            disabled={loading}
                            className={`w-10 h-10 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300 ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages || loading}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === totalPages || loading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      Next
                    </button>

                    {/* Results Count */}
                    <div className="text-sm text-gray-600 ml-4">
                      Showing {((currentPage - 1) * itemsPerPage) + 1}-
                      {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} experts
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