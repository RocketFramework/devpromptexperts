// StepVerification.tsx
"use client";

import { SellerOnboardingFormData, UserStages, UserRoles, OnboardingTierTypes } from "@/types";
import { useState, useEffect } from "react";

interface StepVerificationProps {
  data: SellerOnboardingFormData;
  onUpdate: (data: SellerOnboardingFormData) => void;
  onNext: () => void;
  onBack: () => void;
  isEditing: boolean;
}

export default function StepVerification({ data, onUpdate, onNext, onBack, isEditing }: StepVerificationProps) {
  const [formData, setFormData] = useState(data);
  const [agreedToTerms, setAgreedToTerms] = useState(data.agreed_to_terms || false);

  // Update form data when props change
  useEffect(() => {
    setFormData(data);
    setAgreedToTerms(data.agreed_to_terms || false);
  }, [data]);

  const handleChange = (field: keyof SellerOnboardingFormData, value: boolean) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions to continue.");
      return;
    }
    if (!formData.identity_verification_consented) {
      alert("Identity verification consent is required to continue.");
      return;
    }
    
    // Set final verification flags and complete the data
    const finalData: SellerOnboardingFormData = {
      ...formData,
      agreed_to_terms: true,
      user_type: UserRoles.SELLER,
      onboarding_tier: OnboardingTierTypes.GENERAL,
      stage: UserStages.BIO_DONE // Or whatever your completion stage is
    };
    
    onUpdate(finalData);
    onNext();
  };

  const canSubmit = agreedToTerms && formData.identity_verification_consented;

  // Show commission summary if available
  const showCommissionSummary = formData.commission_type && formData.platform_fee;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification & Final Review</h2>
      <p className="text-gray-600 mb-8">Complete your verification and review your application details.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Commission Summary */}
        {showCommissionSummary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Commission Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-green-600">{formData.platform_fee}</div>
                <div className="text-xs text-gray-600">Platform Fee</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-blue-600">{formData.your_commission}</div>
                <div className="text-xs text-gray-600">Your Commission</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-purple-600">{formData.platform_net}</div>
                <div className="text-xs text-gray-600">Platform Net</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Selected Model</h4>
                <p className="text-green-600 font-medium capitalize">
                  {formData.commission_type === "tiered" ? "Tiered Commission" : "Revenue Share"}
                </p>
                {formData.selected_tier && (
                  <p className="text-xs text-gray-600 mt-1">Target: {formData.selected_tier}</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Payment Method</h4>
                <p className="text-blue-600 font-medium">
                  {formData.payment_method || "Not selected"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Identity Verification */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Identity Verification *</h3>
              <p className="text-gray-600 text-sm">Required for all ambassadors to ensure platform security and trust</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.identity_verification_consented 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.identity_verification_consented ? 'Consent Given' : 'Required'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
              <input
                type="checkbox"
                id="identity_verification_consented"
                required
                checked={formData.identity_verification_consented || false}
                onChange={(e) => handleChange("identity_verification_consented", e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <label htmlFor="identity_verification_consented" className="text-sm font-medium text-gray-900 block">
                  I consent to identity verification *
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Required for all ambassadors. This includes government-issued ID verification and LinkedIn profile validation. 
                  You'll receive detailed instructions via email after submission.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">What to Expect:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Government ID upload</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>LinkedIn profile validation</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>2-3 business day processing</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Secure & encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Verification */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Enhanced Verification</h3>
              <p className="text-gray-600 text-sm">Optional verification for premium enterprise access and higher commissions</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.enhanced_verification_consented 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.enhanced_verification_consented ? 'Interested' : 'Optional'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-300">
              <input
                type="checkbox"
                id="enhanced_verification_consented"
                checked={formData.enhanced_verification_consented || false}
                onChange={(e) => handleChange("enhanced_verification_consented", e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <label htmlFor="enhanced_verification_consented" className="text-sm font-medium text-gray-900 block">
                  I'm interested in enhanced verification
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  This includes comprehensive background check and opens access to Fortune 500 clients and premium projects.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Benefits</h4>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• Access to Fortune 500 clients</li>
                  <li>• Premium project opportunities</li>
                  <li>• Higher commission eligibility</li>
                  <li>• Verified ambassador badge</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-2">Requirements</h4>
                <ul className="text-xs text-purple-800 space-y-1">
                  <li>• Comprehensive background check</li>
                  <li>• Professional reference verification</li>
                  <li>• 5-7 business day processing</li>
                  <li>• Additional documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Basic Identity Verification</span>
                <span className={`text-sm font-medium ${
                  formData.identity_verification_consented ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {formData.identity_verification_consented ? 'Consent Given' : 'Required'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Enhanced Verification</span>
                <span className={`text-sm font-medium ${
                  formData.enhanced_verification_consented ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {formData.enhanced_verification_consented ? 'Interested' : 'Optional'}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">
                {formData.enhanced_verification_consented 
                  ? "You'll be contacted within 24 hours to complete both verification processes."
                  : "Basic verification will be processed after submission. You can opt for enhanced verification later."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ambassador Agreement</h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-3 text-sm text-gray-600">
              <h4 className="font-medium text-gray-900">1. Commission & Payments</h4>
              <p>Ambassadors earn commissions based on the selected model. Payments are processed within 30 days of project completion.</p>
              
              <h4 className="font-medium text-gray-900">2. Client Exclusivity</h4>
              <p>Clients you refer are exclusively yours for 12 months from initial contact.</p>
              
              <h4 className="font-medium text-gray-900">3. Professional Conduct</h4>
              <p>You agree to maintain professional standards and accurately represent the platform to clients.</p>
              
              <h4 className="font-medium text-gray-900">4. Confidentiality</h4>
              <p>All client information and platform data must be kept confidential.</p>
              
              <h4 className="font-medium text-gray-900">5. Verification Requirements</h4>
              <p>Identity verification is required for platform access. Enhanced verification is optional but required for premium clients.</p>
            </div>
          </div>

          <div className="mt-4 flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreed_to_terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              required
            />
            <div>
              <label htmlFor="agreed_to_terms" className="text-sm font-medium text-gray-900">
                I agree to the Ambassador Agreement terms and conditions *
              </label>
              <p className="text-xs text-gray-600 mt-1">
                By checking this box, you acknowledge that you have read, understood, and agree to be bound by all terms of the Ambassador Agreement.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">1</div>
              <p className="text-green-800 font-medium">Application Review</p>
              <p className="text-green-700 text-xs">2-3 business days</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">2</div>
              <p className="text-green-800 font-medium">Verification Process</p>
              <p className="text-green-700 text-xs">Based on your selections</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">3</div>
              <p className="text-green-800 font-medium">Onboarding</p>
              <p className="text-green-700 text-xs">Access to platform & resources</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Profile' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}