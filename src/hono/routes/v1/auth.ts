import { describeRouteJson } from "@/hono/docs";
import { loginSupabaseJwtHandler, logoutHandler, refreshTokenHandler } from "@/hono/handlers/authHandlers";
import { loginResponse, logoutResponse, refreshTokenResponse } from "@/schemas/response";
import { Hono } from "hono";
import { logger } from "hono/logger";

const auth = new Hono();
const tags = ["Authorization"];

auth.use(logger());

auth.post(
  "/login/provider/supabase",
  describeRouteJson({
    tags,
    description: "Login via Supabase JWT",
    successSchema: loginResponse,
  }),
  ...loginSupabaseJwtHandler
);

auth.post(
  "/refresh",
  describeRouteJson({
    tags,
    description: "Refresh access token using a valid refresh token",
    successSchema: refreshTokenResponse,
  }),
  ...refreshTokenHandler
);

auth.post(
  "/logout",
  describeRouteJson({
    tags,
    description: "Logout and invalidate the refresh token",
    successSchema: logoutResponse,
  }),
  ...logoutHandler
)

export const v1Auth = auth;
