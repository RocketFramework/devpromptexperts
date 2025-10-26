// components/onboarding/steps/ProfessionalBackgroundStep.tsx
interface StepProfessionalBackgroundProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const EXECUTIVE_ROLES = [
  'CTO', 'Chief Technology Officer', 
  'CIO', 'Chief Information Officer',
  'VP Engineering', 'Head of Technology',
  'Principal Architect', 'Director of AI',
  'Head of Data Science', 'Chief AI Officer',
  'Technical Director', 'Engineering Manager'
];

export default function StepProfessionalBackground({ data, onUpdate, onNext, onBack }: StepProfessionalBackgroundProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Background</h2>
        <p className="text-gray-600">Tell us about your executive experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current/Most Recent Role *
          </label>
          <select
            required
            value={data.currentRole}
            onChange={(e) => onUpdate({ currentRole: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Role</option>
            {EXECUTIVE_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company/Organization *
          </label>
          <input
            type="text"
            required
            value={data.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Google, Microsoft, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <select
            required
            value={data.yearsExperience}
            onChange={(e) => onUpdate({ yearsExperience: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">Select Experience</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
            <option value="15">15+ years</option>
            <option value="20">20+ years</option>
            <option value="25">25+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio/Website
          </label>
          <input
            type="url"
            value={data.portfolioUrl}
            onChange={(e) => onUpdate({ portfolioUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Bio *
        </label>
        <textarea
          required
          value={data.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your background, achievements, and what makes you an expert in your field..."
        />
        <p className="text-sm text-gray-500 mt-2">
          This will be featured on your public profile. Include key achievements and expertise.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Expertise
        </button>
      </div>
    </form>
  );
}