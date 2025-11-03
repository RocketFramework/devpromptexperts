import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { OnboardingSubmissionData as OnboardingData } from "@/types/";
import { Countries } from "@/types/";

// components/onboarding/steps/PersonalInfoStep.tsx
// interface PersonalInfoData {
//   fullName: string;
//   email: string;
//   phone?: string;
//   country: string;
//   timezone: string;
//   linkedinUrl: string;
// }

interface StepPersonalInfoProps {
  data: OnboardingData["personalInfo"];
  onUpdate: (data: OnboardingData["personalInfo"]) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({
  data,
  onUpdate,
  onNext,
}: StepPersonalInfoProps) {
  const { data: session } = useSession();

  // Populate fields from LinkedIn session if not already filled
  useEffect(() => {
    if (session?.user) {
      const updatedData = {
        ...data,
        fullName: data.fullName || session.user.name || "",
        email: data.email || session.user.email || "",
        country: data.country || session.user.country || "",
        image: data.image || session.user.image || "",
      };
      onUpdate(updatedData);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow">
      <div className="flex justify-center mb-6">
        {data.image ? (
          <img
            src={data.image}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Personal Information
          </h2>
          <p className="text-gray-600">
            Let&apos;s start with your basic details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={data.fullName}
              onChange={(e) => onUpdate({ ...data, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => onUpdate({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onUpdate({ ...data, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              required
              value={data.country}
              onChange={(e) => onUpdate({ ...data, country: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
              {/* Add more countries */}
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
              onChange={(e) => onUpdate({ ...data, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Google, Microsoft, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone *
            </label>
            <select
              required
              value={data.timezone}
              onChange={(e) => onUpdate({ ...data, timezone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">GMT/BST</option>
              <option value="Europe/Berlin">CET/CEST</option>
              <option value="Asia/Singapore">SGT</option>
              <option value="Asia/Tokyo">JST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile *
            </label>
            <input
              type="url"
              required
              value={data.linkedinUrl}
              onChange={(e) =>
                onUpdate({ ...data, linkedinUrl: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Background
          </button>
        </div>
      </form>
    </div>
  );
}
