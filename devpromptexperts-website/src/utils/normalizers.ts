// src/utils/normalizers.ts
import { OnboardingStage } from "@/types/consultant";

const validStages = ["bio", "interview", "probation", "active"] as const;

export function toOnboardingStage(value: string | null): OnboardingStage | undefined {
  if (value && (validStages as readonly string[]).includes(value)) {
    return value as OnboardingStage;
  }
  return undefined;
}
