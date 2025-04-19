import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getWorkersAi } from "../cloudflareBindings";

export const defaultAiConfig = {
  maxTokens: 1024,
  temperature: 1,
  topP: 0.95,
  topK: 40,
};

export const googleAi = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

type CloudflareAiModels = Parameters<ReturnType<typeof getWorkersAi>>[0];
export const cloudflareAi = (model: CloudflareAiModels) => {
  const workersAi = getWorkersAi();
  return workersAi(model);
};
