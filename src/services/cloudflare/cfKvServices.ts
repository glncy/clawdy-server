import { getClawdyAiInstructionsKV } from "@/utils/cloudflareBindings";

export const cfGetCachedModelInstructions = async <T extends Record<string, string>>(
  instructions: T,
  key: keyof T
) => {
  const CLAWDY_AI_INSTRUCTIONS_KV = await getClawdyAiInstructionsKV();
  let kvInstructions = await CLAWDY_AI_INSTRUCTIONS_KV.get(String(key));

  if (!kvInstructions) {
    kvInstructions = instructions[key];
    await CLAWDY_AI_INSTRUCTIONS_KV.put(String(key), kvInstructions);
  }

  return kvInstructions ?? undefined;
};
