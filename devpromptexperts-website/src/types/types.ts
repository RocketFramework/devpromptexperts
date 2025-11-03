import {
  ConsultantStages,
  RouteConfig,
  UserRoles,
  AuthProviders,
  ClientStates,
  LinkedInProfile,
  GoogleProfile,
  FacebookProfile,
  ENGAGEMENT_TYPES,
  Projects_Types,
  Industries,
  TierTypes,
  NoticePeriodTypes
} from "./";

// Generic route map for stage/state based routing
export type RouteMap<T extends string> = Record<T, string>;
export type ConsultantRouteMap = RouteMap<ConsultantStage>;
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
export type ConsultantStage =
  (typeof ConsultantStages)[keyof typeof ConsultantStages];
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
export type ClientState = (typeof ClientStates)[keyof typeof ClientStates];
export type EngagementType = typeof ENGAGEMENT_TYPES[number]['value'];
export type ProjectType = (typeof Projects_Types)[number];
export type Industry = (typeof Industries)[number];
export type TierType = (typeof TierTypes)[number]['label'];
export type NoticePeriodType = (typeof NoticePeriodTypes)[keyof typeof NoticePeriodTypes];