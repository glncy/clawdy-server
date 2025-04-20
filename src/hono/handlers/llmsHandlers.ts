import { createFactory } from "hono/factory";
import { authMiddleware } from "../middlewares/authMiddleware";
import { llmStreamChatService } from "@/services/llmsServices";
import { stream } from "hono/streaming";
import { zodValidator } from "../validator";
import { llmsStreamChatRequest } from "@/schemas/request";
import { z } from "zod";

const factory = createFactory();

export const llmsStreamChatEnum = {
  clawdy: "clawdy",
} as const;

export const llmsStreamChatHandler = factory.createHandlers(
  authMiddleware,
  zodValidator(
    "param",
    z.object({
      name: z
        .nativeEnum(llmsStreamChatEnum)
        .describe("Name of the Chat to use"),
    })
  ),
  zodValidator("json", llmsStreamChatRequest),
  async (context) => {
    const name = context.req.valid("param").name;
    if (name === llmsStreamChatEnum.clawdy) {
      const body = await context.req.json();
      const result = await llmStreamChatService({
        messages: body.messages,
      });

      // Set the content type to text/plain
      context.header("Content-Type", "text/plain; charset=utf-8");

      return stream(context, async (stream) => {
        if (result.body) {
          return stream.pipe(result.body);
        }
      });
    }
  }
);
