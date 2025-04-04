import { createFactory } from "hono/factory";
import {
  verifySupabaseToken,
  generateTokenPair,
  refreshAccessToken,
} from "@/services/authServices";
import { loginSupabaseJwtHeaders } from "@/schemas/request";
import { okResponse, unauthorizedResponse } from "../templateResponses";
import { zodValidator } from "../validator";
import { JWTPayload } from "hono/utils/jwt/types";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { loginResponse, logoutResponse, refreshTokenResponse } from "@/schemas/response";
import { getZodDefaults } from "@/utils/zodUtils";

const COOKIE_SECRET = process.env.COOKIE_SECRET || "";
const REFRESH_TOKEN_KEY = "refreshToken";
const factory = createFactory();

interface SupabaseJWTPayload extends JWTPayload {
  sub: string; // User ID
  is_anonymous: boolean; // Anonymous user flag
  role: string; // User role
  amr: Array<{
    method: string; // Authentication method
    timestamp: number; // Timestamp of authentication
  }>;
}

export const loginSupabaseJwtHandler = factory.createHandlers(
  zodValidator("header", loginSupabaseJwtHeaders),
  async (context) => {
    const supabaseJwt = context.req.valid("header")["X-Supabase-JWT"];
    const verifyJwt = (await verifySupabaseToken(
      supabaseJwt
    )) as SupabaseJWTPayload;
    if (!verifyJwt) {
      throw unauthorizedResponse();
    }

    // Generate tokens for the authenticated user
    const { sub, is_anonymous } = verifyJwt;
    const tokenPair = await generateTokenPair({
      supabase_user_id: sub,
      is_anonymous,
    });

    // set the refresh token in the cookie
    await setSignedCookie(
      context,
      REFRESH_TOKEN_KEY,
      tokenPair.refreshToken,
      COOKIE_SECRET,
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }
    );

    const defaultResponse = getZodDefaults(loginResponse);
    return context.json(
      okResponse({
        ...defaultResponse,
        accessToken: tokenPair.accessToken,
      }),
      200
    );
  }
);

export const refreshTokenHandler = factory.createHandlers(async (context) => {
  const refreshToken = await getSignedCookie(
    context,
    COOKIE_SECRET,
    REFRESH_TOKEN_KEY
  );

  if (!refreshToken) {
    throw unauthorizedResponse();
  }

  const newTokens = await refreshAccessToken(refreshToken);

  if (!newTokens) {
    deleteCookie(context, REFRESH_TOKEN_KEY);
    throw unauthorizedResponse();
  }

  const defaultResponse = getZodDefaults(refreshTokenResponse);
  return context.json(
    okResponse({
      ...defaultResponse,
      accessToken: newTokens.accessToken,
    }),
    200
  );
});

export const logoutHandler = factory.createHandlers(async (context) => {
  deleteCookie(context, REFRESH_TOKEN_KEY);
  const defaultResponse = getZodDefaults(logoutResponse);
  return context.json(
    okResponse({
      ...defaultResponse,
    }),
    200
  );
});
