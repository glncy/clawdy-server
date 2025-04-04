import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";

export const getCfAI = () => {
  const { env } = getCloudflareContext();
  return env.AI;
};

export const getClawdyAiInstructionsKV = () => {
  const { env } = getCloudflareContext();
  return env.CLAWDY_AI_INSTRUCTIONS_KV;
};

export const getWorkersAi = () => {
  const ai = getCfAI();
  return createWorkersAI({
    binding: ai,
  });
};
