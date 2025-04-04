import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";
import { validator } from "hono-openapi/zod";
import { badRequestResponse } from "./templateResponses";

export const zodValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  validator(target, schema, (result) => {
    if (!result.success) {
      throw badRequestResponse(result.error.issues.map((issue) => ({
        message: issue.message,
        code: issue.code,
      })));
    }
  });
