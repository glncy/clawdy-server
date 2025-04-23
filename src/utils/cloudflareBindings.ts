import { CLOUDFLARE_ENABLED } from "@/constants";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";

export const getCfAI = () => {
  if (!CLOUDFLARE_ENABLED) return null;
  const { env } = getCloudflareContext();
  return env.AI;
};

export const getClawdyAiInstructionsKV = () => {
  if (!CLOUDFLARE_ENABLED) return null;
  const { env } = getCloudflareContext();
  return env.CLAWDY_AI_INSTRUCTIONS_KV;
};

export const getWorkersAi = () => {
  const ai = getCfAI();
  if (!ai) {
    return null;
  }

  return createWorkersAI({
    binding: ai,
  });
};
