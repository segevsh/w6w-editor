import { z } from "zod";

/**
 * Error information for execution-level failures
 */
export const executionErrorSchema = z.object({
  message: z.string().describe("Human-readable error message"),

  code: z.string().optional().describe("Error code for programmatic handling"),

  nodeId: z
    .string()
    .optional()
    .describe("Node ID if the error originated from a specific node"),

  stack: z.string().optional().describe("Stack trace for debugging"),

  timestamp: z.number().describe("Unix timestamp in milliseconds when the error occurred"),
});
export type ExecutionError = z.infer<typeof executionErrorSchema>;

/**
 * Error information for node-level failures
 */
export const nodeErrorSchema = z.object({
  message: z.string().describe("Human-readable error message"),

  code: z.string().optional().describe("Error code for programmatic handling"),

  stack: z.string().optional().describe("Stack trace for debugging"),

  retryable: z
    .boolean()
    .default(false)
    .describe("Whether this error is retryable"),
});
export type NodeError = z.infer<typeof nodeErrorSchema>;
