// lib/routes/config.ts
import { 
  RouteConfig, 
  RouteMap, 
  UserStage, 
  ClientState 
} from '@/types/';

export const ROUTE_CONFIG: RouteConfig = {
  PUBLIC: {
    HOME: '/',
    ERROR: '/auth/error',
  },
  AUTH: {
    CONSULTANT_LOGIN: '/auth/consultant/login',
    CLIENT_LOGIN: '/auth/client/login',
    SELLER_LOGIN: '/auth/seller/login',
    ADMIN_LOGIN: '/auth/admin/login',
    CALLBACK: '/auth/callback',
  },
  CONSULTANT: {
    ONBOARDING: '/consultant/onboarding',
    INDUCTION: '/consultant/interview',
    PROBATION: '/consultant/probation',
    DASHBOARD: '/consultant/dashboard',
    PROFILE: '/consultant/profile',
    SETTINGS: '/consultant/setting',
  },
  CLIENT: {
    ONBOARDING: '/client/onboarding',
    INDUCTION: '/client/verification',
    DASHBOARD: '/client/dashboard',
    PROJECTS: '/client/projects',
    PROFILE: '/client/profile',
    BILLING: '/client/billing',
  },
  SELLER: {
    ONBOARDING: '/client/onboarding',
    INDUCTION: '/client/verification',
    DASHBOARD: '/client/dashboard',
    CLIENTS: '/client/projects',
    PROFILE: '/client/profile',
    BILLING: '/client/billing',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/setting',
  },
} as const;

export const CONSULTANT_STAGE_MAP: RouteMap<UserStage> = {
  'none': ROUTE_CONFIG.CONSULTANT.ONBOARDING,
  'bio': ROUTE_CONFIG.CONSULTANT.ONBOARDING,
  'bio-wip': ROUTE_CONFIG.CONSULTANT.ONBOARDING,
  'bio-done': ROUTE_CONFIG.CONSULTANT.INDUCTION,
  'interview': ROUTE_CONFIG.CONSULTANT.INDUCTION,
  'interview-scheduled': ROUTE_CONFIG.CONSULTANT.INDUCTION,
  'interview-done': ROUTE_CONFIG.CONSULTANT.INDUCTION,
  'interview-done-accept': ROUTE_CONFIG.CONSULTANT.PROBATION,
  'interview-done-reject': ROUTE_CONFIG.CONSULTANT.INDUCTION,
  'probation': ROUTE_CONFIG.CONSULTANT.PROBATION,
  'probation-wip': ROUTE_CONFIG.CONSULTANT.PROBATION,
  'probation-done': ROUTE_CONFIG.CONSULTANT.DASHBOARD,
  'professional': ROUTE_CONFIG.CONSULTANT.DASHBOARD,
} as const;

export const CLIENT_STATE_MAP: RouteMap<ClientState> = {
  'onboarding': ROUTE_CONFIG.CLIENT.ONBOARDING,
  'verification-pending': ROUTE_CONFIG.CLIENT.INDUCTION,
  'verification-approved': ROUTE_CONFIG.CLIENT.DASHBOARD,
  'active': ROUTE_CONFIG.CLIENT.DASHBOARD,
  'suspended': ROUTE_CONFIG.CLIENT.INDUCTION,
  'inactive': ROUTE_CONFIG.CLIENT.ONBOARDING,
  'pending': ROUTE_CONFIG.CLIENT.ONBOARDING,
} as const;