// components/consultant/GamifiedInductionPage.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  PlayIcon, 
  DownloadIcon, 
  CheckIcon, 
  CrownIcon, 
  CalendarIcon, 
  DocumentIcon, 
  UserGroupIcon,
  SparklesIcon
} from "@/components/ui/SharedIcons";
import { InductionService } from "@/lib/inductionService";
import { UserInductionProgress } from '@/types';
import { TrophyIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import React from "react";
export default function GamifiedInductionPage() {
  const { data: session } = useSession();
  const [inductionData, setInductionData] = useState<UserInductionProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    const loadInductionData = async () => {
      if (session?.user?.id) {
        const data = await InductionService.getInductionProgress(session.user.id, 'consultant');
        setInductionData(data);
        
        if (data.progress.percentage === 100 && !data.userData.completedAt) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      }
      setLoading(false);
    };
    
    loadInductionData();
  }, [session]);

  const handleStepComplete = async (stepId: string) => {
    if (session?.user?.id) {
      setActiveStep(stepId);
      await InductionService.completeStep(session.user.id, stepId);
      const updatedData = await InductionService.getInductionProgress(session.user.id, 'consultant');
      setInductionData(updatedData);
      
      setTimeout(() => setActiveStep(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700">Loading your elite induction...</p>
        </div>
      </div>
    );
  }

  if (!inductionData) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-800">Error loading induction data</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const { content, progress, userData } = inductionData;
  const currentStepIndex = userData.currentStep - 1;
  const currentStep = content.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 lg:p-8">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 text-center max-w-2xl mx-6 shadow-2xl border border-blue-200">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrophyIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">🎉 Elite Status Unlocked!</h2>
            <p className="text-slate-600 text-lg mb-2">Congratulations on completing your induction</p>
            <p className="text-slate-500 mb-8">Welcome to the inner circle of AI excellence</p>
            <button 
              onClick={() => setShowCelebration(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              Enter Elite Portal
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CrownIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
                <p className="text-slate-600 text-lg">{content.subtitle}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-slate-500 text-sm mb-2">Progress</div>
              <div className="text-2xl font-bold text-slate-900">{progress.percentage}%</div>
              <div className="text-slate-500 text-sm">
                {progress.completed} of {progress.total} completed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 shadow-md"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Current Mission - Takes 2/3 width */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Current Mission</h2>
                  <p className="text-slate-600">Complete this step to continue your journey</p>
                </div>
                <div className="text-right">
                  <div className="text-slate-500 text-sm">Estimated Time</div>
                  <div className="text-xl font-bold text-slate-900">{currentStep.duration}</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{currentStep.title}</h3>
                <p className="text-slate-700 leading-relaxed">{currentStep.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentStep.id === 'watch_video' && (
                  <>
                    <button 
                      onClick={() => handleStepComplete('watch_video')}
                      disabled={activeStep === 'watch_video'}
                      className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg cursor-pointer disabled:cursor-not-allowed flex-1"
                    >
                      {activeStep === 'watch_video' ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <PlayIcon className="w-6 h-6" />
                      )}
                      <span>{activeStep === 'watch_video' ? 'Processing...' : 'Watch Video'}</span>
                    </button>
                    <button className="flex items-center justify-center space-x-3 border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex-1">
                      <DownloadIcon className="w-5 h-5" />
                      <span>Download Materials</span>
                    </button>
                  </>
                )}
                
                {currentStep.id === 'schedule_interview' && (
                  <button 
                    onClick={() => handleStepComplete('schedule_interview')}
                    disabled={activeStep === 'schedule_interview'}
                    className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg cursor-pointer disabled:cursor-not-allowed w-full"
                  >
                    {activeStep === 'schedule_interview' ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CalendarIcon className="w-6 h-6" />
                    )}
                    <span>{activeStep === 'schedule_interview' ? 'Scheduling...' : 'Schedule Interview'}</span>
                  </button>
                )}

                {currentStep.id === 'complete_profile' && (
                  <button 
                    onClick={() => handleStepComplete('complete_profile')}
                    disabled={activeStep === 'complete_profile'}
                    className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg cursor-pointer disabled:cursor-not-allowed w-full"
                  >
                    {activeStep === 'complete_profile' ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <DocumentIcon className="w-6 h-6" />
                    )}
                    <span>{activeStep === 'complete_profile' ? 'Updating...' : 'Complete Profile'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Steps - Below Current Mission */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Your Journey</h3>
              
              <div className="space-y-6">
                {content.steps.map((step, index) => {
                  const isCompleted = userData.completedSteps.includes(step.id);
                  const isCurrent = userData.currentStep === index + 1 && !isCompleted;
                  
                  return (
                    <div key={step.id} className="flex items-start space-x-6 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isCompleted ? (
                          <CheckIcon className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold text-lg ${
                              isCompleted ? 'text-green-600' : 
                              isCurrent ? 'text-blue-600' : 
                              'text-slate-700'
                            }`}>
                              {step.title}
                              {isCurrent && (
                                <span className="ml-3 text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                            </h4>
                            <p className="text-slate-600 mt-1">{step.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500 text-sm">Time</div>
                            <div className="text-slate-700 font-semibold">{step.duration}</div>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1/3 width */}
          <div className="space-y-8">
            {/* Level Progress */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Elite Level</h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CrownIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">Level {Math.floor(progress.completed / 2) + 1}</div>
                <div className="text-slate-600">Consultant Rank</div>
              </div>
            </div>

            {/* Unlockable Benefits */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Elite Benefits</h3>
              <div className="space-y-4">
                {[
                  { threshold: 25, title: "Priority Access", icon: "🚀", unlocked: progress.percentage >= 25 },
                  { threshold: 50, title: "Elite Network", icon: "🤝", unlocked: progress.percentage >= 50 },
                  { threshold: 75, title: "VIP Matching", icon: "⭐", unlocked: progress.percentage >= 75 },
                  { threshold: 100, title: "Founding Member", icon: "👑", unlocked: progress.percentage === 100 }
                ].map((benefit, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    benefit.unlocked ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      benefit.unlocked ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {benefit.unlocked ? <CheckIcon className="w-4 h-4" /> : <LockClosedIcon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{benefit.title}</div>
                      <div className="text-sm text-slate-600">
                        {benefit.unlocked ? 'Unlocked' : `Complete ${benefit.threshold}%`}
                      </div>
                    </div>
                    <div className="text-2xl">{benefit.icon}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Your Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{progress.completed}</div>
                  <div className="text-sm text-slate-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">{progress.total - progress.completed}</div>
                  <div className="text-sm text-slate-600">Remaining</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{progress.percentage}%</div>
                  <div className="text-sm text-slate-600">Progress</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{userData.currentStep}</div>
                  <div className="text-sm text-slate-600">Current Step</div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Need Help?</h3>
              <p className="text-slate-600 mb-4">Our elite support team is here to assist you.</p>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}