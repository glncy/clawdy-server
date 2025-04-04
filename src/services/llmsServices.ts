import { CoreMessage } from "ai";
import { cfAiChatStreamService } from "./cloudflare/cfAiServices";
import * as instructions from "@/utils/llms/instructions";
import { cfGetCachedModelInstructions } from "./cloudflare/cfKvServices";

interface LlmStreamChatSeviceProps {
  messages?: CoreMessage[];
}

export const llmStreamChatService = async (props: LlmStreamChatSeviceProps) => {
  const systemInstructions = await cfGetCachedModelInstructions(
    instructions,
    "clawdy_finance_ai_instructions_md"
  );

  const result = cfAiChatStreamService({
    model: "@cf/meta/llama-3.2-1b-instruct",
    messages: props.messages,
    system: systemInstructions,
  });

  return result;
};
