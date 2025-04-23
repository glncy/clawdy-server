import { CLOUDFLARE_ENABLED } from "@/constants";

if (!CLOUDFLARE_ENABLED) {
  throw new Error(
    "You are not on Cloudflare Environment. Please use / route instead of /cf route."
  );
}

export * from "@/hono/route";
