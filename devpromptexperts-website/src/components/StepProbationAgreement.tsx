// components/onboarding/steps/ProbationAgreementStep.tsx
import { useState } from "react";

interface ProbationAgreementData {
  probationTermsAccepted?: boolean;
}

interface StepProbationAgreementProps {
  data: ProbationAgreementData;
  onUpdate: (data: Partial<ProbationAgreementData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepProbationAgreement({ data, onUpdate, onNext, onBack }: StepProbationAgreementProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(data.probationTermsAccepted || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return; // safety check
    onUpdate({ probationTermsAccepted: true });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Probation Period Agreement</h2>
        <p className="text-gray-600">Understand your path to full platform access</p>
      </div>

      {/* Probation Requirements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Probation Requirements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600 font-bold">1</span>
              </div>
              Complete 2 Free Consultations
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              Maintain 4.5+ Client Rating
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              Deliver Projects On Time
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600 font-bold">4</span>
              </div>
              Platform Quality Review
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="border border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Probation Terms & Conditions</h3>
        <div className="space-y-4 text-sm text-gray-600">
          {/* Repeat the existing 4 sections as-is */}
          {/* ... */}
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="probation-agreement"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="probation-agreement" className="text-sm text-gray-700">
          I understand and agree to the probation terms. I commit to completing 2 free consultation projects 
          and maintaining platform performance standards to qualify for paid project access.
        </label>
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
          disabled={!acceptedTerms}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
}
