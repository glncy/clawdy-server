import { z } from "zod";

export const loginSupabaseJwtHeaders = z.object({
  "X-Supabase-JWT": z
    .string({
      required_error: "X-Supabase-JWT header is required",
    })
    .nonempty({
      message: "X-Supabase-JWT header cannot be empty",
    }),
});

export const llmsStreamChatRequest = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "tool"]),
      content: z.string(),
    })
  ),
});
