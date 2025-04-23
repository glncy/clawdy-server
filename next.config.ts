import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { withPayload } from '@payloadcms/next/withPayload'

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
