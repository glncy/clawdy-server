import { verify, sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET || "";
const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET || "";
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";

export const verifySupabaseToken = async (token: string) => {
  try {
    const decoded = await verify(token, SUPABASE_JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

interface TokenPayload {
  supabase_user_id: string;
  is_anonymous: boolean;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate token
 * @param opts Options for generating the token
 * @param opts.payload Payload to include in the token
 * @param opts.secret Secret key to sign the token
 * @param opts.expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Generated token
 */

interface GenerateTokenOptions {
  payload: TokenPayload;
  type: "access" | "refresh";
  secret: string;
  expiresIn?: number;
}

export const generateToken = async (opts: GenerateTokenOptions): Promise<string> => {
  const expiresIn = opts.expiresIn || 60 * 60; // Default to 1 hour
  const token = await sign(
    {
      ...opts.payload,
      type: opts.type,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    },
    opts.secret
  );
  return token;
};

/**
 * Generate both access and refresh tokens
 * @param payload User information to include in the tokens
 */
export const generateTokenPair = async (
  payload: TokenPayload
): Promise<TokenResponse> => {
  const refreshTokenExpiry = 60 * 60 * 24 * 30; // 30 days
  
  const accessToken = await generateToken({
    payload,
    secret: ACCESS_TOKEN_JWT_SECRET,
    type: "access",
  });
  const refreshToken = await generateToken({
    payload,
    secret: REFRESH_TOKEN_JWT_SECRET,
    type: "refresh",
    expiresIn: refreshTokenExpiry,
  });

  const accessTokenExpiry = 15 * 60; // 15 minutes
  const expiresIn = Date.now() + (accessTokenExpiry * 1000); // Convert to milliseconds
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};

type TokenJWTPayload = TokenPayload & JWTPayload;
/**
 * Verify an access token
 * @param token Access token to verify
 */
export const verifyAccessToken = async (token: string) => {
  try {
    const decoded = await verify(token, ACCESS_TOKEN_JWT_SECRET) as TokenJWTPayload;
    if (decoded.type !== "access") {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Error verifying access token:", error);
    return null;
  }
};

/**
 * Verify a refresh token
 * @param token Refresh token to verify
 */
export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = await verify(token, REFRESH_TOKEN_JWT_SECRET) as TokenJWTPayload;
    if (decoded.type !== "refresh") {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};

/**
 * Refresh an access token using a refresh token
 * @param refreshToken Valid refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse | null> => {
  const decoded = await verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return null;
  }
  
  // Extract payload without JWT claims remove iat, exp, nbf and type
  delete decoded.iat;
  delete decoded.exp;
  delete decoded.nbf;
  delete decoded.type;

  const newTokenPair = await generateTokenPair(decoded);

  return newTokenPair;
};
