import {
  UserStages,
  RouteConfig,
  UserRoles,
  AuthProviders,
  UserStates,
  LinkedInProfile,
  GoogleProfile,
  FacebookProfile,
  ENGAGEMENT_TYPES_DATA,
  Projects_Types,
  Industries,
  OnboardingTierTypeData,
  NoticePeriodTypes,
  TimeWindowEnum, 
  PROJECT_BUDGETS
} from "./";

// Generic route map for stage/state based routing
export type RouteMap<T extends string> = Record<T, string>;
export type ConsultantRouteMap = RouteMap<UserStage>;
export type ClientRouteMap = RouteMap<ClientState>;
export type PublicRoute = RouteConfig["PUBLIC"][keyof RouteConfig["PUBLIC"]];
export type AuthRoute = RouteConfig["AUTH"][keyof RouteConfig["AUTH"]];
export type ConsultantRoute =
  RouteConfig["CONSULTANT"][keyof RouteConfig["CONSULTANT"]];
export type ClientRoute = RouteConfig["CLIENT"][keyof RouteConfig["CLIENT"]];
export type AdminRoute = RouteConfig["ADMIN"][keyof RouteConfig["ADMIN"]];
export type AppRoute =
  | PublicRoute
  | AuthRoute
  | ConsultantRoute
  | ClientRoute
  | AdminRoute;
export type SocialProfile = LinkedInProfile | GoogleProfile | FacebookProfile;
export type AuthProvider = (typeof AuthProviders)[keyof typeof AuthProviders];
export type UserStage =
  (typeof UserStages)[keyof typeof UserStages];
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
export type ClientState = (typeof UserStates)[keyof typeof UserStates];
export type EngagementType = typeof ENGAGEMENT_TYPES_DATA[number]['value'];
export type ProjectType = (typeof Projects_Types)[number];
export type Industry = (typeof Industries)[number];
export type TierType = (typeof OnboardingTierTypeData)[number]['label'];
export type NoticePeriodType = (typeof NoticePeriodTypes)[keyof typeof NoticePeriodTypes];
//export type TimeWindowType = (typeof TimeWindowTypes)[keyof typeof TimeWindowTypes]; // '7d' | '30d' | '90d' | 'ytd'
export type TimeWindowType = TimeWindowEnum;
export type ProjectBudgetType = (typeof PROJECT_BUDGETS)[number];