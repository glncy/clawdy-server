import { getWorkersAi } from "@/utils/cloudflareBindings";
import { streamText } from "ai";

type StreamText = Omit<Parameters<typeof streamText>[0], "model">;

interface CfAiChatStreamServiceProps extends StreamText {
  model: Parameters<ReturnType<typeof getWorkersAi>>[0];
}

export const cfAiChatStreamService = ({
  model,
  ...props
}: CfAiChatStreamServiceProps) => {
  const workersAi = getWorkersAi();
  const _model = workersAi(model);
  const result = streamText({
    model: _model,
    ...props,
  });

  return result;
};
