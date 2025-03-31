import { z } from "zod";

export const healthCheckResponse = z.object({
  status: z.string(),
  timestamp: z.string(),
});

export const llmsIndexResponse = z.object({
  status: z.string(),
  timestamp: z.string(),
});