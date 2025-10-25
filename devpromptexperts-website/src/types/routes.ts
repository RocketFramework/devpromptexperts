// types/routes.ts
import { ConsultantStage, ClientState } from './types';

// Base route configuration structure
export interface RouteConfig {
  PUBLIC: {
    HOME: string;
    ERROR: string;
  };
  AUTH: {
    CONSULTANT_LOGIN: string;
    CLIENT_LOGIN: string;
    CALLBACK: string;
  };
  CONSULTANT: {
    ONBOARDING: string;
    INTERVIEW: string;
    PROBATION: string;
    DASHBOARD: string;
    PROFILE: string;
    SETTINGS: string;
  };
  CLIENT: {
    ONBOARDING: string;
    VERIFICATION: string;
    DASHBOARD: string;
    PROJECTS: string;
    PROFILE: string;
    BILLING: string;
  };
  ADMIN: {
    DASHBOARD: string;
    USERS: string;
    ANALYTICS: string;
    SETTINGS: string;
  };
}

// Generic route map for stage/state based routing
export type RouteMap<T extends string> = Record<T, string>;

// Specific route maps for our application
export type ConsultantRouteMap = RouteMap<ConsultantStage>;
export type ClientRouteMap = RouteMap<ClientState>;

// Utility types for route validation
export type PublicRoute = RouteConfig['PUBLIC'][keyof RouteConfig['PUBLIC']];
export type AuthRoute = RouteConfig['AUTH'][keyof RouteConfig['AUTH']];
export type ConsultantRoute = RouteConfig['CONSULTANT'][keyof RouteConfig['CONSULTANT']];
export type ClientRoute = RouteConfig['CLIENT'][keyof RouteConfig['CLIENT']];
export type AdminRoute = RouteConfig['ADMIN'][keyof RouteConfig['ADMIN']];

export type AppRoute = PublicRoute | AuthRoute | ConsultantRoute | ClientRoute | AdminRoute;