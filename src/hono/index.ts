import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { healthCheckResponse } from "@/schemas/response";
import { apiReference } from "@scalar/hono-api-reference";
import { v1ApiRoutes } from "@/hono/routes/v1";
import { apiRefOptions, describeRouteJson, docSpecs } from "@/hono/docs";
import { okResponse } from "@/hono/templateResponses";

const basePath = "/api";
const app = new Hono().basePath(basePath);

// API for health check
app.get(
  "/health-check",
  describeRouteJson({
    tags: ["Health Check"],
    description: "Health Check",
    successSchema: healthCheckResponse,
  }),
  (context) => {
    return context.json(
      okResponse({
        status: "ok",
        timestamp: new Date().toISOString(),
      }),
      200
    );
  }
);

// API v1 Routes
app.route("/v1", v1ApiRoutes);
// API v1 OpenAPI specs
app.get(
  "/v1/open-api",
  openAPISpecs(
    new Hono().basePath(`${basePath}/v1`).route("/", v1ApiRoutes),
    docSpecs({
      title: `Clawdy API`,
      version: "v1",
      description: "Clawdy API",
    })
  )
);
// API v1 Docs
app.get(
  "/v1/docs",
  apiReference(
    apiRefOptions({
      url: `${basePath}/v1/open-api`,
    })
  )
);

export default app;
