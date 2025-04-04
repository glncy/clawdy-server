import { createMiddleware } from "hono/factory";
import { badRequestResponse, unauthorizedResponse } from "../templateResponses";
import { verifyAccessToken } from "@/services/authServices";

export const authMiddleware = createMiddleware<{
  Variables: {
    authInfo: Awaited<ReturnType<typeof verifyAccessToken>>;
  };
}>(async (context, next) => {
  const authHeader = context.req.header("Authorization");
  if (!authHeader) {
    throw unauthorizedResponse();
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    throw badRequestResponse([
      {
        message: "Invalid Authorization header format",
        code: "invalid_header_format",
      },
    ]);
  }

  // verify access token
  const authInfo = await verifyAccessToken(token);

  if (!authInfo) {
    throw unauthorizedResponse();
  }

  // set authInfo to context variables
  context.set("authInfo", authInfo);

  await next();
});
