import { z } from "zod";

export const healthCheckResponse = z.object({
  status: z.string(),
  timestamp: z.string(),
});

export const loginResponse = z.object({
  message: z.string().default("Login Successful"),
  code: z.string().default("login_successful"),
  accessToken: z.string(),
});

export const refreshTokenResponse = z.object({
  message: z.string().default("Token refreshed successfully"),
  code: z.string().default("token_refreshed"),
  accessToken: z.string(),
});

export const logoutResponse = z.object({
  message: z.string().default("Logout Successful"),
  code: z.string().default("logout_successful"),
});