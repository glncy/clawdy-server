import { Hono } from "hono";
import { handle } from "hono/vercel";
import { v1ApiRoutes } from "./routes/v1";
import { describeRoute, openAPISpecs } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { healthCheckResponse } from "@/schemas/response";
import { apiReference } from "@scalar/hono-api-reference";

const app = new Hono().basePath("/api");

app.get(
  "/health-check",
  describeRoute({
    tags: ["Health Check"],
    description: "Health Check",
    responses: {
      200: {
        description: "Health Check Response",
        content: {
          "application/json": {
            schema: resolver(healthCheckResponse),
          },
        },
      },
    },
  }),
  (ctx) => {
    return ctx.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  }
);

// API v1 Routes
app.route("/v1", v1ApiRoutes);

// OpenAPI specs
app.get(
  "/open-api",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Clawdy API",
        version: "1.0.0",
        description: "Clawdy API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  })
);

// UI for OpenAPI specs
app.get(
  "/docs",
  apiReference({
    url: "/api/open-api",
  })
);

export const GET = handle(app);
export const POST = handle(app);
