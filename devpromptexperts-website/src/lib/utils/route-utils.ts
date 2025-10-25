// lib/utils/route-utils.ts
import { 
  AppRoute, 
  ConsultantStage, 
  ClientState, 
  ConsultantRouteMap, 
  ClientRouteMap,
} from '@/types';

import { isConsultantStage, isClientState } from "@/types/auth";
import { CONSULTANT_STAGE_MAP, CLIENT_STATE_MAP, ROUTE_CONFIG } from '@/lib/routes/config';

export class RouteUtils {
  // Get the appropriate route based on user role and stage/state
  static getTargetRoute(role: string, stageOrState?: string): AppRoute {
    switch (role) {
      case 'consultant':
        const stage = stageOrState as ConsultantStage;
        if (stage && isConsultantStage(stage)) {
          return CONSULTANT_STAGE_MAP[stage];
        }
        return ROUTE_CONFIG.CONSULTANT.ONBOARDING;
      
      case 'client':
        const state = stageOrState as ClientState;
        if (state && isClientState(state)) {
          return CLIENT_STATE_MAP[state];
        }
        return ROUTE_CONFIG.CLIENT.ONBOARDING;
      
      case 'admin':
        return ROUTE_CONFIG.ADMIN.DASHBOARD;
      
      default:
        return ROUTE_CONFIG.AUTH.CONSULTANT_LOGIN;
    }
  }

  // Check if a route requires authentication
  static requiresAuth(route: string): boolean {
    return (
      route.startsWith('/consultant') ||
      route.startsWith('/client') || 
      route.startsWith('/admin')
    );
  }

  // Get the appropriate login page for a protected route
  static getLoginPageForRoute(route: string): string {
    if (route.startsWith('/consultant')) {
      return ROUTE_CONFIG.AUTH.CONSULTANT_LOGIN;
    }
    if (route.startsWith('/client')) {
      return ROUTE_CONFIG.AUTH.CLIENT_LOGIN;
    }
    if (route.startsWith('/admin')) {
      return ROUTE_CONFIG.AUTH.CONSULTANT_LOGIN; // or specific admin login
    }
    return ROUTE_CONFIG.AUTH.CONSULTANT_LOGIN;
  }
}