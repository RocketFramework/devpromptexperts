// hooks/useOnboarding.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { OnboardingStep, OnboardingFormData, ClientUser } from "../types";
import { RpcBusinessService } from "@/services/extended";
import { useSession } from "next-auth/react";

interface UseOnboardingReturn {
  currentStep: string;
  steps: OnboardingStep[];
  loading: boolean;
  user: ClientUser | null;
  updateOnboardingStep: (
    stepData: OnboardingFormData,
    nextStep?: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  completeOnboarding: () => Promise<{
    success: boolean;
    data?: any;
    error?: any;
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
    { id: "company_info", title: "Company Info", fields: ["company_name"] },
    { id: "industry", title: "Industry", fields: ["industry"] },
    { id: "company_size", title: "Company Size", fields: ["company_size"] },
    { id: "client_type", title: "Client Type", fields: ["client_type"] },
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
    stepData: OnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: OnboardingFormData; error?: any }> => {
    setLoading(true);
    try {
      const { data, error } = await RpcBusinessService.updateOnboardingProgress(
        session?.user.id || "",
        stepData,
        nextStep
      );

      if (error) throw error;

      if (nextStep) {
        setCurrentStep(nextStep);
      }

      return { success: true, data};
    } catch (error) {
      console.error("Error updating onboarding:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (): Promise<{
    success: boolean;
    data?: any;
    error?: any;
  }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("complete_onboarding");
      if (error) throw error;

      // Redirect to dashboard after completion
      router.push("/dashboard");
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
