// components/onboarding/steps/StepFounderBenefitsStep.tsx
import React from "react";

interface FounderBenefitsData {
  interestedInEquity: boolean;
  wantAdvisoryRole: boolean;
  referralContacts: string;
  specialRequests: string;
}

interface StepFounderBenefitsProps {
  data: FounderBenefitsData;
  onUpdate: (data: Partial<FounderBenefitsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFounderBenefits({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepFounderBenefitsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Founder 100 Benefits
        </h2>
        <p className="text-gray-600">
          Unlock exclusive opportunities as a founding member
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold">🎯</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Founder 100 Exclusive Benefits
            </h3>
            <ul className="space-y-2 text-gray-700">
              {[
                "Equity consideration in devpromptexperts",
                "Premium positioning in search results",
                "Access to highest-value projects first",
                "Platform advisory role opportunities",
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Equity Participation */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Equity Participation</h4>
            <p className="text-sm text-gray-600">
              Express interest in equity consideration
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.interestedInEquity}
              onChange={(e) =>
                onUpdate({ interestedInEquity: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Platform Advisory Role */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Platform Advisory Role</h4>
            <p className="text-sm text-gray-600">
              Help shape the future of the platform
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.wantAdvisoryRole}
              onChange={(e) =>
                onUpdate({ wantAdvisoryRole: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Referral Contacts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Contacts
          </label>
          <textarea
            value={data.referralContacts}
            onChange={(e) =>
              onUpdate({ referralContacts: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Know other top AI experts who might be interested in joining? Share their details..."
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests or Notes
          </label>
          <textarea
            value={data.specialRequests}
            onChange={(e) =>
              onUpdate({ specialRequests: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any specific requests or information you'd like to share with our team..."
          />
        </div>
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
          Review Application
        </button>
      </div>
    </form>
  );
}
