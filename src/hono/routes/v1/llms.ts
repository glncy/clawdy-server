import { llmsStreamChatHandler } from "@/hono/handlers/llmsHandlers";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";

const llms = new Hono();
const tags = ["LLMs"];

llms.post(
  "/stream/chat",
  describeRoute({
    tags,
    description: "Entry point for chat streaming using Vercel AI SDK",
    responses: {
      200: {
        description: "Successful response",
        headers: {
          "Content-Type": {
            description: "Indicates an event stream",
            schema: {
              type: "string",
              example: "text/event-stream",
            },
          },
        },
        content: {
          "text/event-stream": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  }),
  ...llmsStreamChatHandler
);

export const v1Llms = llms;
