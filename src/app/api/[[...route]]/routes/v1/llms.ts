import { llmsIndexResponse } from "@/schemas/response";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

const llms = new Hono();
const tag = "LLMs";

llms.get(
  "/",
  describeRoute({
    tags: [tag],
    description: "LLMs API",
    responses: {
      200: {
        description: "LLMs API Response",
        content: {
          "application/json": {
            schema: resolver(llmsIndexResponse),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      status: "this is the index of llms route",
      timestamp: new Date().toISOString(),
    });
  }
);

export const v1Llms = llms;
