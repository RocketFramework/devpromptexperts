// components/onboarding/steps/SuccessStep.tsx
import { MouseEvent, useState, useEffect } from "react";
import {
  OnboardingSubmissionData as OnboardingData,
  PartnershipData,
} from "@/types/";
import { ConsultantsBusinessService } from "@/services/business/ConsultantBusinessService";
import { RpcBusinessService } from "@/services/extended/RpcBusinessService";

interface StepSuccessProps {
  data: OnboardingData;
  partnershipData: PartnershipData | null;
  referralToken?: string | null;
}

interface AvailableSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  slot_date: string;
  day_of_week: string;
}

export default function StepSuccess({
  data,
  partnershipData,
  referralToken,
}: StepSuccessProps) {
  const [founderNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<[string, Date] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timezone, setTimezone] = useState<string>("UTC");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const partnerId = partnershipData?.PartnerId ?? "";
  // FETCH AVAILABLE INTERVIEW SLOTS ON COMPONENT MOUNT
  useEffect(() => {
    if (!partnerId) return;

    const fetchAvailableSlots = async () => {
      try {
        setIsLoading(true);
        // Using the provided RpcBusinessService
        const slots: AvailableSlot[] =
          await RpcBusinessService.getFormattedPartnerSlots(partnerId);
        console.log("slots ", slots);
        setAvailableSlots(slots ?? []);
        // Assuming timezone might come from the API or we can use local timezone
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      } catch (error) {
        console.error("Failed to fetch interview slots:", error);
        setMessage({
          type: "error",
          text: "Failed to load available interview slots. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [partnerId]);

  const handleSlotSelection = (slotId: string, slotDate: Date) => {
    setSelectedSlot([slotId, slotDate]);
    setMessage(null); // Clear any previous messages
  };

  const handleScheduleInterview = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedSlot) {
      setMessage({
        type: "error",
        text: "Please select an interview slot to continue.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const [selectedSlotId, selectedSlotDate] = selectedSlot ?? [];
      // IMPORTANT: ASSUMING ConsultantBusinessService.scheduleInterview() EXISTS
      await ConsultantsBusinessService.scheduleInterview({
        slotId: selectedSlotId,
        consultantId: data.personalInfo.Id, // ASSUMING ID IS AVAILABLE IN DATA
        partnerId : partnershipData?.PartnerId??"",
        partnershipId: partnershipData?.PartnershipId??"",
        interviewDate: selectedSlotDate,
      });

      setMessage({
        type: "success",
        text: "Interview scheduled successfully! You will receive a confirmation email shortly.",
      });

      // Optionally refresh available slots to update UI
      const updatedSlots = await RpcBusinessService.getFormattedPartnerSlots(
        partnerId
      );
      setAvailableSlots(updatedSlots);
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      setMessage({
        type: "error",
        text: "Failed to schedule interview. Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDashboardRedirect = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = "/consultants/dashboard";
  };

  // FORMAT DATE FOR DISPLAY
  const formatSlotDate = (slotDate: string): string => {
    const date = new Date(slotDate);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // FORMAT TIME FOR DISPLAY
  const formatSlotTime = (timeString: string): string => {
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to the Founder 100!
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        Your application has been received and you&apos;re one step closer to
        joining our exclusive community.
      </p>

      {/* Referral Bonus Notice */}
      {referralToken && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-lg">🎁</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Referral Bonus Unlocked!
              </h3>
              <p className="text-green-700 text-sm">
                You joined via referral - you&apos;ll receive priority
                onboarding and special community benefits.
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
          {founderNumber > 25 &&
            founderNumber <= 50 &&
            "🚀 Pioneer Member Tier"}
          {founderNumber > 50 && "⭐ Charter Expert Tier"}
        </div>
      </div>

      {/* INTERVIEW SCHEDULING SECTION - UPDATED */}
      <div className="bg-white border border-blue-200 rounded-2xl p-6 max-w-4xl mx-auto mb-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Schedule Your Onboarding Interview
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Let&apos;s get you onboarded! Select a convenient time for your
          30-minute onboarding call with our founder team.
        </p>

        {/* Timezone Info */}
        <div className="text-sm text-gray-500 mb-4">
          All times shown in: <strong>{timezone}</strong>
        </div>

        {/* Available Slots Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading available slots...
            </span>
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {availableSlots.map((slot) => (
              <div
                key={slot.slot_id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSlot === slot.slot_id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-25"
                }`}
                onClick={() => handleSlotSelection(slot.slot_id, slot.slot_date)}
              >
                <div className="font-semibold text-gray-900">
                  {formatSlotDate(slot.slot_date)}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {slot.day_of_week}
                </div>
                <div className="text-sm text-gray-600">
                  {formatSlotTime(slot.start_time)} -{" "}
                  {formatSlotTime(slot.end_time)}
                </div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  ✅ Available
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-yellow-50 rounded-lg mb-6">
            <p className="text-yellow-800 font-medium">
              No available slots at the moment. Please check back later or
              contact us directly.
            </p>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Schedule Button */}
        {availableSlots.length > 0 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleScheduleInterview}
              disabled={!selectedSlot || isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedSlot && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Scheduling...
                </>
              ) : (
                "Confirm Interview Time"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Next Steps - UPDATED TO INCLUDE INTERVIEW INFO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Interview Scheduled
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedSlot
                    ? "Your interview is scheduled! Check your email for details."
                    : "Schedule your onboarding call above to meet the team."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Profile Review</h4>
                <p className="text-sm text-gray-600">
                  Our team reviews your application and expertise areas (24-48
                  hours)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Welcome Package</h4>
                <p className="text-sm text-gray-600">
                  Receive your Founder 100 welcome package and platform access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          While You Wait...
        </h3>
        <div className="space-y-3 text-sm text-yellow-700 text-left">
          <p>
            ✅ <strong>Prepare your portfolio:</strong> Gather case studies and
            project examples
          </p>
          <p>
            ✅ <strong>Update your LinkedIn:</strong> Ensure your profile
            reflects your expertise
          </p>
          <p>
            ✅ <strong>Think about availability:</strong> Consider your schedule
            for upcoming projects
          </p>
          <p>
            ✅ <strong>Review our platform guide:</strong> We&apos;ll send this
            after approval
          </p>
          {selectedSlot && (
            <p>
              ✅ <strong>Prepare for interview:</strong> Review your application
              and be ready to discuss your AI expertise
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Questions about scheduling? Contact our founder team at{" "}
          <a
            href="mailto:founders@devpromptexperts.com"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            founders@devpromptexperts.com
          </a>
        </p>
        <button
          onClick={handleDashboardRedirect}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
