import { OnboardingSubmissionData as OnboardingData } from "@/types/";
import { ExpertiseOptions as AI_EXPERTISE_AREAS, Industries as INDUSTRIES, Projects_Types as PROJECT_TYPES } from "@/types/";


interface StepExpertiseProps {
  data: OnboardingData['expertise'];
  onUpdate: (data: Partial<OnboardingData['expertise']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepExpertise({ data, onUpdate, onNext, onBack }: StepExpertiseProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleArrayItem = (array: string[], item: string) =>
    array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Expertise & Skills
        </h2>
        <p className="text-gray-600">
          Define your technical specialization and consulting focus
        </p>
      </div>

      {/* Primary Expertise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary AI Expertise Areas *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AI_EXPERTISE_AREAS.map((expertise) => (
            <label
              key={expertise}
              className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.primaryExpertise.includes(expertise)}
                onChange={() =>
                  onUpdate({ ...data, primaryExpertise: toggleArrayItem(data.primaryExpertise, expertise) })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-700">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Industry Experience *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INDUSTRIES.map((industry) => (
            <label
              key={industry}
              className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.industries.includes(industry)}
                onChange={() =>
                  onUpdate({ ...data, industries: toggleArrayItem(data.industries, industry) })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Project Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Project Types *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PROJECT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.projectTypes.includes(type)}
                onChange={() =>
                  onUpdate({ ...data, projectTypes: toggleArrayItem(data.projectTypes, type) })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rate & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              required
              min={50}
              max={1000}
              value={data.hourlyRate}
              onChange={(e) =>
                onUpdate({ ...data, hourlyRate: parseInt(e.target.value) })
              }
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="200"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Typical rates for experts: $150-$500/hr
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Project Size (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              required
              min={1000}
              max={100000}
              step={1000}
              value={data.minProjectSize}
              onChange={(e) =>
                onUpdate({ ...data, minProjectSize: parseInt(e.target.value) })
              }
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Smallest project you&apos;ll consider
            Smallest project you&apos;ll consider
          </p>
        </div>
      </div>

      {/* Secondary Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Technical Skills
        </label>
        <textarea
          value={data.secondarySkills.join(", ")}
          onChange={(e) =>
            onUpdate({...data, 
              secondarySkills: e.target.value
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            })
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Python, TensorFlow, AWS, Kubernetes, Docker, React, Node.js..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Separate skills with commas
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
          Continue to Availability
        </button>
      </div>
    </form>
  );
}
