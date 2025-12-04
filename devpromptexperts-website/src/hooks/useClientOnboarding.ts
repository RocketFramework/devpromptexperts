// hooks/useOnboarding.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import {
  OnboardingStep,
  ClientOnboardingFormData,
  ClientUser,
  UserStage,
  UserStages,
} from "../types";
import { RpcBusinessService } from "@/services/extended";
import { useSession } from "next-auth/react";

interface UseOnboardingReturn {
  currentStep: string;
  steps: OnboardingStep[];
  loading: boolean;
  user: ClientUser | null;
  updateOnboardingStep: (
    stepData: ClientOnboardingFormData,
    nextStep?: string
  ) => Promise<{ success: boolean; data?: unknown; error?: unknown }>;
  completeOnboarding: (
    stepData: ClientOnboardingFormData
  ) => Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }>;
  setCurrentStep: (step: string) => void;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<ClientUser | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const steps: OnboardingStep[] = [
    { id: "welcome", title: "Welcome", fields: [] },
    { id: "user_profile", title: "Profile", fields: ["profile"] },
    { id: "company_info", title: "Company Info", fields: ["company_name"] },
    { id: "needs_analysis", title: "Need Analysis", fields: [] },
    { id: "completion", title: "Complete", fields: [] },
  ];

  useEffect(() => {
    // Get current user session
    const getUser = async (): Promise<void> => {
      const user = session?.user;
      if (user) {
        // Fetch user profile from public.users table
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser(userProfile as ClientUser);
      }
    };
    getUser();
  }, []);

  const updateOnboardingStep = async (
    stepData: ClientOnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: unknown; error?: unknown }> => {
    setLoading(true);
    stepData.stage = UserStages.BIO_WIP; // Update stage to onboarding in progress
    try {
      console.log(
        "Updating onboarding with data:",
        stepData,
        "Next step:",
        nextStep
      );
      const { data, error } =
        await RpcBusinessService.updateClientOnboardingProgress(
          session?.user.id || "",
          stepData,
          nextStep
        );

      if (error) throw error;

      if (nextStep) {
        setCurrentStep(nextStep);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error updating onboarding:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (
    stepData: ClientOnboardingFormData
  ): Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }> => {
    setLoading(true);
    try {
      const { data, error } = await RpcBusinessService.completeClientOnboarding(
        session?.user.id || "", 
        stepData
      );
      if (error) throw error;

      // Redirect to dashboard after completion
      router.push("/client/induction");
      return { success: true, data };
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    steps,
    loading,
    user,
    updateOnboardingStep,
    completeOnboarding,
    setCurrentStep,
  };
};
