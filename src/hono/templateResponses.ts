import { getZodDefaults } from "@/utils/zodUtils";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const okResponse = (data: object) => {
  return {
    ...data,
  };
};

export const badRequestSchema = z.object({
  message: z.string().default("Bad Request"),
  code: z.string().default("bad_request"),
  errors: z.array(
    z.object({
      message: z.string(),
      code: z.string(),
    })
  ),
});

export const badRequestResponse = (
  errors: Array<{
    message: string;
    code: string;
  }>
) => {
  return new HTTPException(400, {
    res: Response.json({
      ...getZodDefaults(badRequestSchema),
      errors: errors,
    }),
  });
};

export const unauthorizedSchema = z.object({
  message: z.string().default("Unauthorized"),
  code: z.string().default("unauthorized"),
});

export const unauthorizedResponse = () => {
  return new HTTPException(401, {
    res: Response.json({
      ...getZodDefaults(unauthorizedSchema),
    }),
  });
};

export const forbiddenSchema = z.object({
  message: z.string().default("Forbidden"),
  code: z.string().default("forbidden"),
});

export const forbiddenResponse = () => {
  return new HTTPException(403, {
    res: Response.json({
      ...getZodDefaults(forbiddenSchema),
    }),
  });
};

export const internalServerErrorSchema = z.object({
  message: z.string().default("Internal Server Error"),
  code: z.string().default("internal_server_error"),
});

export const internalServerErrorResponse = () => {
  return new HTTPException(500, {
    res: Response.json({
      ...getZodDefaults(internalServerErrorSchema),
    }),
  });
}
