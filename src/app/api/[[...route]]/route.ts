import { CLOUDFLARE_ENABLED } from "@/constants";

if (CLOUDFLARE_ENABLED) {
  throw new Error(
    "You are on Cloudflare Environment. Please use /cf route instead of / route."
  );
}

export const runtime = "edge";
export * from "@/hono/route";
