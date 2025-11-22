// components/consultant/ProfileHeader.tsx
import { ConsultantNewDTO as ConsultantDTO} from "@/types/dtos/ConsultantNew.dto"

interface ProfileHeaderProps {
  consultant: ConsultantDTO;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export default function ProfileHeader({ consultant, isOwnProfile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  {consultant.user_id?.slice(0, 2).toUpperCase()}
                </div>
                {consultant.featured && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900 shadow-lg">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {consultant.title || 'AI Consultant'}
                </h1>
                <div className="flex items-center mt-4 space-x-6">
                  {consultant.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-300 text-lg">
                        {'★'.repeat(Math.floor(consultant.rating))}
                        {'☆'.repeat(5 - Math.floor(consultant.rating))}
                      </div>
                      <span className="text-white/90 font-semibold">
                        {consultant.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {consultant.projects_completed && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/90">
                        {consultant.projects_completed} projects
                      </span>
                    </div>
                  )}
                  {consultant.work_experience && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white/90">
                        {consultant.work_experience} years exp
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 md:mt-0 flex space-x-4">
              {isOwnProfile ? (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                    💬 Message
                  </button>
                  <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg">
                    📅 Book Consultation
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}