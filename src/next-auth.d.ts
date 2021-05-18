import "next-auth";
import "next-auth/jwt";
import { DataResidency } from "./types";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    clientId?: string;
    clientSecret?: string;
    dataResidency?: DataResidency;
    error?: string;
  }

  interface User {
    dataResidency?: DataResidency;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    dataResidency?: DataResidency;
    error?: string;
    accessToken?: string;
    expiresAt?: number;
  }
}
