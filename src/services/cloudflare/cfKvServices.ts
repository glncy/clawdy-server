import { getClawdyAiInstructionsKV } from "@/utils/cloudflareBindings";

const IS_PROD = process.env.NODE_ENV === "production";

export const cfGetCachedModelInstructions = async <T extends Record<string, string>>(
  instructions: T,
  key: keyof T
) => {
  if (!IS_PROD) {
    return instructions[key];
  }
  const CLAWDY_AI_INSTRUCTIONS_KV = await getClawdyAiInstructionsKV();

  if (!CLAWDY_AI_INSTRUCTIONS_KV) {
    throw new Error("Cloudflare KV is not available");
  }

  let kvInstructions = await CLAWDY_AI_INSTRUCTIONS_KV.get(String(key));

  if (!kvInstructions) {
    kvInstructions = instructions[key];
    await CLAWDY_AI_INSTRUCTIONS_KV.put(String(key), kvInstructions);
  }

  return kvInstructions ?? undefined;
};
