import { handle } from "hono/vercel";
import app from "@/hono";

// Hono Handler for Vercel
export const GET = handle(app);
export const POST = handle(app);
