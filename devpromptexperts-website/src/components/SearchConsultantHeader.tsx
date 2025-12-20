// components/consultants/ConsultantSearchHeader.tsx
interface SearchConsultantHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export default function SearchConsultantHeader({
  searchQuery,
  onSearchChange,
  resultCount,
}: SearchConsultantHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Find Your AI Expert
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
            Connect with top AI consultants specializing in machine learning,
            deep learning, computer vision, NLP, and business AI transformation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, expertise, skills, or project requirements..."
              className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {resultCount} {resultCount === 1 ? 'expert' : 'experts'} found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}