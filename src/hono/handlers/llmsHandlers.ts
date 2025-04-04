import { createFactory } from "hono/factory";
import { authMiddleware } from "../middlewares/authMiddleware";
import { llmStreamChatService } from "@/services/llmsServices";
import { stream } from "hono/streaming";
import { zodValidator } from "../validator";
import { llmsStreamChatRequest } from "@/schemas/request";

const factory = createFactory();

export const llmsStreamChatHandler = factory.createHandlers(
  authMiddleware,
  zodValidator("json", llmsStreamChatRequest),
  async (context) => {
    const body = await context.req.json();
    const result = await llmStreamChatService({
      messages: body.messages,
    });

    // Set the content type to text/plain
    context.header("Content-Type", "text/plain; charset=utf-8");
    return stream(context, (stream) => stream.pipe(result.toDataStream()));
  }
);
