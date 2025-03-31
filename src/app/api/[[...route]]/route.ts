import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/health-check", (ctx) => {
  return ctx.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export const GET = handle(app);
export const POST = handle(app);
