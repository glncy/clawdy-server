import {
  suggestedRepliesSchema,
  transactionsSchema,
} from "@/schemas/toolSchemas";
import { tool } from "ai";
import { z } from "zod";

export const saveTransactions = tool({
  description: "Save finalized transaction notes",
  parameters: transactionsSchema,
});

export const beforeDraftTransactions = tool({
  description: "Get existing categories and other financial data from client without execution",
  parameters: z.object({}),
});

export const draftTransactions = tool({
  description: "Draft financial transactions from chat",
  parameters: transactionsSchema,
});

export const suggestedReplies = tool({
  description: "Generate reply suggestions",
  parameters: suggestedRepliesSchema,
});
