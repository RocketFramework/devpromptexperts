// components/client/ClientInductionPage.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  PlayIcon, 
  DownloadIcon, 
  CheckIcon, 
  SparklesIcon, 
  ProjectIcon, 
  ExpertsIcon, 
  SecurityIcon,
  CalendarIcon,
  DocumentIcon,
  UserGroupIcon,
  HomeIcon
} from "@/components/ui/SharedIcons";
import { useRouter } from "next/navigation";
import { ActionCard } from "@/components/ui/ActionCard";
import { NextStep } from "@/components/ui/NextStep";
import { InductionService } from "@/lib/inductionService";
import { UserInductionProgress } from '@/types/';
import { UserRoles } from "@/types/";

const iconMap = {
  calendar: CalendarIcon,
  document: DocumentIcon,
  users: UserGroupIcon,
  'sales-kit': DocumentIcon,
  commission: DocumentIcon,
  client: UserGroupIcon,
  project: ProjectIcon,
  experts: ExpertsIcon,
  security: SecurityIcon
};

export default function ClientInductionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [inductionData, setInductionData] = useState<UserInductionProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInductionData = async () => {
      if (session?.user?.id) {
        const data = await InductionService.getInductionProgress(session.user.id, UserRoles.CLIENT);
        setInductionData(data);
      }
      setLoading(false);
    };
    
    loadInductionData();
  }, [session]);

  const handleStepComplete = async (stepId: string) => {
    if (session?.user?.id) {
      await InductionService.completeStep(session.user.id, stepId);
      // Reload data to update progress
      const updatedData = await InductionService.getInductionProgress(session.user.id, UserRoles.CLIENT);
      setInductionData(updatedData);
    }
  };

  const handleActionClick = async (actionId: string, requiredStep?: string) => {
    if (requiredStep && !inductionData?.userData.completedSteps.includes(requiredStep)) {
      alert('Please complete the required step first');
      return;
    }
    
    // Handle action based on actionId
    console.log(`Action clicked: ${actionId}`);
    
    // If this action completes a step, mark it
    if (actionId === 'complete_brief' || actionId === 'review_matches' || actionId === 'launch_project') {
      await handleStepComplete(actionId);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!inductionData) {
    return <div className="min-h-screen flex items-center justify-center">Error loading induction data</div>;
  }

  const { content, progress, userData } = inductionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{content.title}</h1>
                <p className="text-slate-600 text-sm">{content.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                {content.badgeText}
              </div>
              <p className="text-sm text-slate-500">{content.statusText}</p>
              <button
                onClick={() => session?.user?.id && router.push(`/client/${session.user.id}/dashboard`)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm mt-2 transition-colors shadow-sm"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {session?.user?.name ? `Welcome, ${session.user.name}!` : content.welcomeTitle}
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-6">
            {content.welcomeDescription}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-purple-800 text-sm font-medium">{content.highlightText}</p>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <p className="text-xl font-semibold">{content.videoTitle}</p>
                    <p className="text-blue-100 mt-2">Duration: {content.videoDuration}</p>
                  </div>
                  {content.videoRequired && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Required
                    </div>
                  )}
                  {!content.videoRequired && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <h3 className="font-semibold text-slate-800 mb-3">What You&#39;ll Learn:</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {content.learningPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <button 
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
              onClick={() => handleStepComplete('watch_video')}
            >
              <PlayIcon className="w-5 h-5" />
              <span>Play Video</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
              <DownloadIcon className="w-5 h-5" />
              <span>Download Client Guide</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {content.actions.map((action, index) => {
            const IconComponent = iconMap[action.icon as keyof typeof iconMap] || DocumentIcon;
            const isCompleted = userData.completedSteps.includes(action.id);
            const canAccess = !action.requiredStep || userData.completedSteps.includes(action.requiredStep);
            const status = isCompleted ? 'completed' : canAccess ? 'current' : 'pending';
            
            return (
              <ActionCard
                key={action.id}
                icon={<IconComponent className="w-8 h-8" />}
                title={action.title}
                description={action.description}
                buttonText={action.buttonText}
                buttonColor={action.buttonColor}
                status={status}
                iconColor="text-blue-600"
                onButtonClick={() => handleActionClick(action.id, action.requiredStep)}
              />
            );
          })}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Your Setup Progress</h2>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-blue-600">{progress.completed}</span> of {progress.total} steps completed
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.steps.map((step, index) => {
              const isCompleted = userData.completedSteps.includes(step.id);
              const isCurrent = userData.currentStep === index + 1 && !isCompleted;
              const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';
              
              return (
                <NextStep
                  key={step.id}
                  number={(index + 1).toString()}
                  title={step.title}
                  description={step.description}
                  status={status}
                  duration={step.duration}
                />
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-center">{content.benefits.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {content.benefits.items.map((item, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-purple-100 text-sm mt-2 font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-purple-200 text-xs mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{content.support.title}</h3>
            <p className="text-slate-700 mb-4 max-w-2xl mx-auto">{content.support.description}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
                {content.support.primaryAction}
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
                {content.support.secondaryAction}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}