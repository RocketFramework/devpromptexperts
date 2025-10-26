// components/onboarding/steps/SuccessStep.tsx
interface StepSuccessProps {
  data: any;
  referralToken?: string | null;
}

export default function StepSuccess({ data, referralToken }: StepSuccessProps) {
  // Generate a random founder number between 1-100
  const founderNumber = Math.floor(Math.random() * 100) + 1;

  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      {/* Main Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Founder 100!</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        Your application has been received and you're one step closer to joining our exclusive community.
      </p>

      {/* Referral Bonus Notice */}
      {referralToken && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-lg">🎁</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Referral Bonus Unlocked!</h3>
              <p className="text-green-700 text-sm">
                You joined via referral - you'll receive priority onboarding and special community benefits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Founder Number Badge */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 max-w-sm mx-auto mb-8 text-white">
        <div className="text-5xl font-bold mb-2">{founderNumber}</div>
        <div className="text-lg font-semibold">Your Founder Number</div>
        <div className="text-blue-100 text-sm mt-2">
          {founderNumber <= 25 && "🎯 Founding Partner Tier"}
          {founderNumber > 25 && founderNumber <= 50 && "🚀 Pioneer Member Tier"}
          {founderNumber > 50 && "⭐ Charter Expert Tier"}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Application Review</h4>
            <p className="text-sm text-gray-600">Our team will review your application within 24-48 hours</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Community Access</h4>
            <p className="text-sm text-gray-600">Get invited to our exclusive Founder 100 community platform</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">First Projects</h4>
            <p className="text-sm text-gray-600">Receive priority access to premium AI consulting opportunities</p>
          </div>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          While You Wait...
        </h3>
        <div className="space-y-3 text-sm text-yellow-700 text-left">
          <p>✅ <strong>Prepare your portfolio:</strong> Gather case studies and project examples</p>
          <p>✅ <strong>Update your LinkedIn:</strong> Ensure your profile reflects your expertise</p>
          <p>✅ <strong>Think about availability:</strong> Consider your schedule for upcoming projects</p>
          <p>✅ <strong>Review our platform guide:</strong> We'll send this after approval</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Questions? Contact our founder team at{' '}
          <a href="mailto:founders@devpromptexperts.com" className="text-blue-600 hover:text-blue-700 font-semibold">
            founders@devpromptexperts.com
          </a>
        </p>
        <button
          onClick={() => window.location.href = '/consultants/dashboard'}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}