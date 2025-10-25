// components/consultants/ConsultantSearchHeader.tsx
interface ConsultantSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export default function ConsultantSearchHeader({
  searchQuery,
  onSearchChange,
  resultCount,
}: ConsultantSearchHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your AI Expert
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with top AI consultants specializing in machine learning, 
            deep learning, computer vision, NLP, and business AI transformation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, expertise, skills, or project requirements..."
              className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            {resultCount} {resultCount === 1 ? 'expert' : 'experts'} found
          </div>
        </div>
      </div>
    </div>
  );
}