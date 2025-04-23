import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.CLOUDFLARE_ENABLED) {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
