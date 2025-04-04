import { HTTPException } from "hono/http-exception";

export const okResponse = (data: object) => {
  return {
    ...data,
  };
};

export const badRequestResponse = (
  errors: Array<{
    message: string;
    code: string;
  }>
) => {
  return new HTTPException(400, {
    res: Response.json({
      message: "Bad Request",
      code: "bad_request",
      errors: errors,
    }),
  });
};

export const unauthorizedResponse = () => {
  return new HTTPException(401, {
    res: Response.json({
      message: "Unauthorized",
      code: "unauthorized",
    }),
  });
};

export const forbiddenResponse = () => {
  return new HTTPException(403, {
    res: Response.json({
      message: "Forbidden",
      code: "forbidden",
    }),
  });
};
