// hooks/useSellerOnboarding.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import {
  OnboardingStep,
  SellerOnboardingFormData,
  SellerUser,
  UserStages,
  UserRoles,
  OnboardingTierTypes,
} from "../types";
import { RpcBusinessService } from "@/services/extended";
import { useSession } from "next-auth/react";

interface UseSellerOnboardingReturn {
  currentStep: string;
  steps: OnboardingStep[];
  loading: boolean;
  user: SellerUser | null;
  updateOnboardingStep: (
    stepData: SellerOnboardingFormData,
    nextStep?: string
  ) => Promise<{ success: boolean; data?: unknown; error?: unknown }>;
  completeOnboarding: (stepData: SellerOnboardingFormData) => Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }>;
  setCurrentStep: (step: string) => void;
}

export const useSellerOnboarding = (): UseSellerOnboardingReturn => {
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<SellerUser | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const steps: OnboardingStep[] = [
    { id: "welcome", title: "Welcome", fields: [] },
    { id: "seller_profile", title: "Profile", fields: ["profile"] },
    { id: "network_overview", title: "Network", fields: ["network"] },
    { id: "commission_agreement", title: "Agreement", fields: ["agreement"] },
    { id: "verification", title: "Verification", fields: [] },
    { id: "completion", title: "Complete", fields: [] },
  ];

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const user = session?.user;
      if (user) {
        // Fetch user profile from public.users table
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser(userProfile as SellerUser);

        // Check if user has existing onboarding progress
        if (userProfile?.onboarding_progress) {
          const progress = userProfile.onboarding_progress;
          if (progress.current_step) {
            setCurrentStep(progress.current_step);
          }
        }
      }
    };
    getUser();
  }, [session]);

  const updateOnboardingStep = async (
    stepData: SellerOnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: unknown; error?: unknown }> => {
    setLoading(true);
    stepData.stage = UserStages.BIO_WIP; // Update stage to onboarding in progress

    try {
      console.log(
        "Updating seller onboarding with data:",
        stepData,
        "Next step:",
        nextStep
      );

      // Use the same RPC service but with seller-specific data
      const { data, error } =
        await RpcBusinessService.updateSellerOnboardingProgress(
          session?.user.id || "",
          {
            ...stepData,
            user_type: UserRoles.SELLER, // Mark as seller type
            onboarding_tier: OnboardingTierTypes.GENERAL,
          },
          nextStep
        );

      if (error) throw error;

      if (nextStep) {
        setCurrentStep(nextStep);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error updating seller onboarding:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (
    stepData: SellerOnboardingFormData
  ): Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }> => {
    setLoading(true);
    try {
      // Use seller-specific completion if available, otherwise use generic
      const { data, error } = await RpcBusinessService.completeSellerOnboarding(
        session?.user.id || "",
        stepData
      );

      if (error) throw error;

      // Redirect to seller induction after completion
      router.push("/seller/induction");
      return { success: true, data };
    } catch (error) {
      console.error("Error completing seller onboarding:", error);
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
