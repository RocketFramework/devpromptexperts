// types/index.ts
export * from "./routes";

// Re-export commonly used types for convenience
export type {
  RouteConfig,
  RouteMap,
  ConsultantRouteMap,
  ClientRouteMap,
  AppRoute,
} from "./routes";

export type { UserRole, ConsultantStage, ClientState } from "./types";
