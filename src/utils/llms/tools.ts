import {
  suggestedRepliesSchema,
  transactionsSchema,
} from "@/schemas/toolSchemas";
import { tool } from "ai";

export const saveTransactions = tool({
  description: "Save finalized transaction notes",
  parameters: transactionsSchema,
});

export const draftTransactions = tool({
  description: "Draft financial transactions from chat",
  parameters: transactionsSchema,
});

export const suggestedReplies = tool({
  description: "Generate reply suggestions",
  parameters: suggestedRepliesSchema,
});
