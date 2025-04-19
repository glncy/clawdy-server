import { z } from "zod";

export const healthCheckResponse = z.object({
  status: z.string().describe("Current operational status of the service"),
  timestamp: z.string().describe("ISO timestamp when the health check was performed"),
}).describe("Response schema for service health monitoring endpoint");

export const loginResponse = z.object({
  message: z.string().default("Login Successful").describe("Human-readable success message"),
  code: z.string().default("login_successful").describe("Machine-readable status code for programmatic handling"),
  accessToken: z.string().describe("JWT access token for authenticated requests"),
}).describe("Authentication response containing access token and status information");

export const refreshTokenResponse = z.object({
  message: z.string().default("Token refreshed successfully").describe("Human-readable success message"),
  code: z.string().default("token_refreshed").describe("Machine-readable status code for programmatic handling"),
  accessToken: z.string().describe("Newly issued JWT access token"),
}).describe("Response schema for token refresh operations with new access token");

export const logoutResponse = z.object({
  message: z.string().default("Logout Successful").describe("Human-readable success message"),
  code: z.string().default("logout_successful").describe("Machine-readable status code for programmatic handling"),
}).describe("Response schema for successful logout operations");