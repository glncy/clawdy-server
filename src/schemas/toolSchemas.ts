import { z } from "zod";

export const suggestedRepliesSchema = z
  .object({
    suggestedReplies: z
      .array(z.string().min(1).max(50))
      .min(3)
      .max(6)
      .describe("Array of contextually relevant suggested replies (3-6 items) for the user to choose from"),
  })
  .describe("Schema for generating suggested quick replies based on conversation context");

export const transactionsSchema = z
  .object({
    transactions: z
      .array(
        z
          .object({
            name: z.string().min(1),
            amount: z.number().min(1),
            category: z.string().min(1),
            categoryEmoji: z.string().describe("Visual emoji representation of the transaction category"),
            transactionType: z.enum(["income", "expense"]),
          })
          .describe("Individual financial transaction record with categorization and type")
      )
      .describe("Collection of financial transactions to be processed or saved"),
  })
  .describe("Schema for handling multiple financial transaction records in a single request");
