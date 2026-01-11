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
    <div className="relative bg-slate-900 border-b border-white/5 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Expert</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Connect with top AI consultants specializing in machine learning,
            deep learning, computer vision, NLP, and business AI transformation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-slate-400 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, expertise, skills, or project requirements..."
              className="block w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-xl text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all outline-none shadow-2xl"
            />
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {resultCount} {resultCount === 1 ? 'expert' : 'experts'} available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}