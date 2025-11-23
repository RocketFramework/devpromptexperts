// components/OnboardingWizard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingFormData } from '@/types';

export const OnboardingWizard: React.FC = (): JSX.Element => { // ✅ Add return type
  const { currentStep, steps, loading, user, updateOnboardingStep, completeOnboarding } = useOnboarding();
  const [formData, setFormData] = useState<OnboardingFormData>({});
  const router = useRouter();

  const handleNext = async (stepData: OnboardingFormData = {}): Promise<void> => {
    const updatedData: OnboardingFormData = { ...formData, ...stepData };
    setFormData(updatedData);

    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const nextStep = steps[currentIndex + 1]?.id;

    if (nextStep) {
      await updateOnboardingStep(updatedData, nextStep);
    } else {
      await completeOnboarding();
    }
  };

  const renderStep = (): JSX.Element => { // ✅ Add return type here too
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Our Platform!
            </h1>
            <p className="text-gray-600 mb-8">
              Let's get your company set up. This will only take a few minutes.
            </p>
            <button 
              onClick={() => handleNext()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Get Started
            </button>
          </div>
        );

      case 'company_info':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target as HTMLFormElement);
              handleNext({ company_name: data.get('company_name') as string });
            }} className="space-y-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  placeholder="Enter your company name"
                  required
                  defaultValue={formData.company_name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </form>
          </div>
        );

      case 'industry':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What industry are you in?</h2>
            <div className="space-y-4">
              <select 
                value={formData.industry || ''}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
              <button 
                onClick={() => handleNext({ industry: formData.industry })} 
                disabled={loading || !formData.industry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                type="button"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 'company_size':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Size</h2>
            <div className="space-y-4">
              <select 
                value={formData.company_size || ''}
                onChange={(e) => setFormData({...formData, company_size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
              <button 
                onClick={() => handleNext({ company_size: formData.company_size })} 
                disabled={loading || !formData.company_size}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                type="button"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 'client_type':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of client are you?</h2>
            <div className="space-y-4">
              <select 
                value={formData.client_type || ''}
                onChange={(e) => setFormData({...formData, client_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Client Type</option>
                <option value="startup">Startup</option>
                <option value="small_business">Small Business</option>
                <option value="enterprise">Enterprise</option>
                <option value="agency">Agency</option>
                <option value="freelancer">Freelancer</option>
                <option value="other">Other</option>
              </select>
              <button 
                onClick={() => handleNext({ client_type: formData.client_type })} 
                disabled={loading || !formData.client_type}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                type="button"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Complete! 🎉</h2>
            <p className="text-gray-600 mb-8">Your account is ready to use.</p>
            <button 
              onClick={() => handleNext()} 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              type="button"
            >
              {loading ? 'Redirecting...' : 'Go to Dashboard'}
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        );
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return ( // ✅ This return statement is crucial!
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-sm font-medium ${
                  index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};