import {
  CoreMessage,
  createDataStreamResponse,
  generateObject,
  smoothStream,
  streamText,
} from "ai";
import * as instructions from "@/utils/llms/instructions";
import { cfGetCachedModelInstructions } from "./cloudflare/cfKvServices";
import {
  cloudflareAi,
  defaultAiConfig,
  googleAi,
} from "@/utils/llms/aiSdkLlms";
import { suggestedRepliesSchema } from "@/schemas/toolSchemas";
import { draftTransactions, saveTransactions } from "@/utils/llms/tools";

interface LlmStreamChatSeviceProps {
  messages?: CoreMessage[];
}

export function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export const llmStreamChatService = async (props: LlmStreamChatSeviceProps) => {
  const chatSystemInstruction = await cfGetCachedModelInstructions(
    instructions,
    "clawdy_ai_instructions_md"
  );
  const toolsInstructions = await cfGetCachedModelInstructions(
    instructions,
    "clawdy_ai_tools_instructions_md"
  );
  const suggestedRepliesInstruction = await cfGetCachedModelInstructions(
    instructions,
    "clawdy_ai_suggested_replies_instructions_md"
  );

  const cfModel = cloudflareAi("@cf/meta/llama-3.3-70b-instruct-fp8-fast");
  const geminiModel = googleAi("gemini-2.0-flash-001");

  const models = {
    cloudflare: cfModel,
    gemini: geminiModel,
  } as const;
  type Models = keyof typeof models;

  const chatModel: Models = "gemini";
  const suggestedRepliesModel: Models = "gemini";

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        ...defaultAiConfig,
        model: models[chatModel],
        messages: props.messages,
        system: chatSystemInstruction + toolsInstructions,
        toolCallStreaming: true,
        experimental_transform: smoothStream({
          delayInMs: 20,
        }),
        tools: {
          saveTransactions,
          draftTransactions,
        },
        onFinish: async (message) => {
          if (message.finishReason === "stop") {
            const { object } = await generateObject({
              model: models[suggestedRepliesModel],
              messages: [
                ...(props.messages ?? []),
                {
                  role: "assistant",
                  content: message.text,
                },
              ],
              system: chatSystemInstruction + suggestedRepliesInstruction,
              schema: suggestedRepliesSchema,
            });

            dataStream.writeMessageAnnotation({
              suggestedReplies: object.suggestedReplies,
            });
          }
        },
        maxSteps: 5,
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: errorHandler,
  });
};
