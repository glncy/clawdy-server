import { z } from "zod";

export const loginSupabaseJwtHeaders = z.object({
  "X-Supabase-JWT": z
    .string({
      required_error: "X-Supabase-JWT header is required",
    })
    .nonempty({
      message: "X-Supabase-JWT header cannot be empty",
    })
    .describe("Authentication JWT token from Supabase for validating user identity"),
}).describe("Authentication headers schema containing required Supabase JWT token");

export const llmsStreamChatRequest = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "tool"])
        .describe("Role of the message sender in the conversation context"),
      content: z.string()
        .describe("Actual content of the message"),
    }).describe("Individual message in the chat conversation with role and content")
  ).describe("Array of messages representing the conversation history"),
}).describe("Request schema for streaming chat completions with an LLM model");
