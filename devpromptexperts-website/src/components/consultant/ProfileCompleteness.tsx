// components/dashboard/ProfileCompleteness.tsx
import Link from 'next/link';

interface ProfileCompletenessProps {
  score: number;
  consultantId: string;
}

export default function ProfileCompleteness({ score, consultantId }: ProfileCompletenessProps) {
  const improvements = [
    { task: 'Add case studies', percentage: 15, completed: false },
    { task: 'Upload intro video', percentage: 10, completed: false },
    { task: 'Complete use cases', percentage: 20, completed: false },
    { task: 'Add project portfolio', percentage: 10, completed: true },
    { task: 'Verify certifications', percentage: 5, completed: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completeness</h3>
        <span className="text-2xl font-bold text-blue-600">{score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {/* Improvement Suggestions */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">Complete your profile to get more clients:</p>
        {improvements.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {item.task}
              </span>
            </div>
            {!item.completed && (
              <span className="text-sm text-blue-600 font-medium">+{item.percentage}%</span>
            )}
          </div>
        ))}
      </div>

      <Link 
        href={`/consultant/${consultantId}/edit`}
        className="w-full mt-6 inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
      >
        Complete Profile
      </Link>
    </div>
  );
}