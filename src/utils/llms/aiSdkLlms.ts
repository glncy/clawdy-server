import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getWorkersAi } from "../cloudflareBindings";
import { CLOUDFLARE_ENABLED, CURRENT_ENV } from "@/constants";

export const defaultAiConfig = {
  maxTokens: 1024,
  temperature: 1,
  topP: 0.95,
  topK: 40,
};

const googleAiGateway =
  "https://gateway.ai.cloudflare.com/v1/98bae7e52ca93aeab52f69d53e51755c/clawdy-ai-gateway/google-ai-studio/v1beta";
export const googleAi = createGoogleGenerativeAI({
  baseURL:
    CLOUDFLARE_ENABLED && CURRENT_ENV !== "development"
      ? googleAiGateway
      : undefined,
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

type GetWorkersAi = Exclude<ReturnType<typeof getWorkersAi>, null>;
type CloudflareAiModels = Parameters<GetWorkersAi>[0];
export const cloudflareAi = (model: CloudflareAiModels) => {
  const workersAi = getWorkersAi();
  if (!workersAi) {
    return undefined;
  }
  return workersAi(model);
};
