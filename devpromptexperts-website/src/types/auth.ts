// types/auth.ts
import { UserRole, UserStage, ClientState } from '@/types/';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  stage?: UserStage;
  state?: ClientState;
  name?: string;
  image?: string;
  email_verified?: Date;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

// Type guards for runtime validation
export function isUserRole(role: string): role is UserRole {
  return ['consultant', 'client', 'admin'].includes(role);
}

export function isConsultantStage(stage: string): stage is UserStage {
  const validStages: UserStage[] = [
    'bio', 'bio-wip', 'bio-done', 'interview', 'interview-scheduled',
    'interview-done', 'interview-done-accept', 'interview-done-reject',
    'probation', 'probation-wip', 'probation-done', 'professional'
  ];
  return validStages.includes(stage as UserStage);
}

export function isClientState(state: string): state is ClientState {
  const validStates: ClientState[] = [
    'onboarding', 'verification-pending', 'verification-approved', 
    'active', 'suspended'
  ];
  return validStates.includes(state as ClientState);
}