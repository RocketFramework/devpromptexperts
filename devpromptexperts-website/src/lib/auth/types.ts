// lib/auth/types.ts
import { JWT } from "next-auth/jwt";

export type Role = "consultant" | "customer" | "sales" | "admin";

export interface CustomJWT extends JWT {
  role?: Role;
  id?: string;
  provider?: string;
}
