// components/consultant/InductionPage.tsx
"use client";
import { useSession } from "next-auth/react";

export default function ConsultantInductionPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                <CrownIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Elite AI Consultants
                </h1>
                <p className="text-slate-600 text-sm">Founding Member Portal</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Prestigious Member
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Welcome, {session?.user?.name || "Elite Consultant"}!
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            You've been selected to join our exclusive network of top-tier AI
            consultants. Watch the introduction video below to begin your
            journey.
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <div className="text-center text-white">
                <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <p className="text-xl font-semibold">
                  Platform Introduction Video
                </p>
                <p className="text-blue-100 mt-2">Duration: 8 minutes</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <PlayIcon className="w-5 h-5" />
              <span>Play Video</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              <DownloadIcon className="w-5 h-5" />
              <span>Download Materials</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={<CalendarIcon className="w-8 h-8" />}
            title="Schedule Interview"
            description="Book your onboarding session with our partner"
            buttonText="Schedule Now"
            buttonColor="bg-blue-600 hover:bg-blue-700"
          />

          <ActionCard
            icon={<DocumentIcon className="w-8 h-8" />}
            title="Review Guidelines"
            description="Read our elite consultant handbook"
            buttonText="View Guidelines"
            buttonColor="bg-slate-700 hover:bg-slate-800"
          />

          <ActionCard
            icon={<UserGroupIcon className="w-8 h-8" />}
            title="Meet the Network"
            description="Connect with other founding members"
            buttonText="Explore Network"
            buttonColor="bg-purple-600 hover:bg-purple-700"
          />
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Your Next Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NextStep
              number="1"
              title="Watch Introduction Video"
              status="completed"
            />
            <NextStep
              number="2"
              title="Schedule Onboarding Interview"
              status="current"
            />
            <NextStep
              number="3"
              title="Complete Profile Setup"
              status="pending"
            />
            <NextStep
              number="4"
              title="Access First Projects"
              status="pending"
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mt-8">
          <p className="text-slate-600 mb-4">Need immediate assistance?</p>
          <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold transition-colors">
            Contact Onboarding Team
          </button>
        </div>
      </div>
    </div>
  );
}

// Action Card Component
function ActionCard({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
}: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4 text-sm">{description}</p>
      <button
        className={`w-full ${buttonColor} text-white py-2 rounded-lg font-semibold transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );
}

// Next Step Component
function NextStep({ number, title, status }: any) {
  const statusConfig = {
    completed: {
      bg: "bg-green-500",
      border: "border-green-500",
      text: "text-green-700",
      icon: <CheckIcon className="w-4 h-4 text-white" />,
    },
    current: {
      bg: "bg-blue-600",
      border: "border-blue-600",
      text: "text-blue-700",
      icon: null,
    },
    pending: {
      bg: "bg-slate-300",
      border: "border-slate-300",
      text: "text-slate-600",
      icon: null,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
      <div
        className={`w-8 h-8 rounded-full border-2 ${config.bg} ${config.border} flex items-center justify-center flex-shrink-0`}
      >
        {config.icon || (
          <span
            className={`text-sm font-bold ${
              status === "current" ? "text-white" : "text-slate-700"
            }`}
          >
            {number}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${config.text}`}>{title}</p>
        <p className="text-sm text-slate-500 capitalize">{status}</p>
      </div>
    </div>
  );
}

// Icons
function CrownIcon(props: any) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PlayIcon(props: any) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function DocumentIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UserGroupIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
