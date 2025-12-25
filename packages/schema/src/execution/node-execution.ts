import { z } from "zod";
import { nodeExecutionStatusSchema } from "./status";
import { nodeErrorSchema } from "./errors";

/**
 * Context for nodes executing inside a loop
 *
 * Tracks iteration information for nodes that are part of a loop structure.
 */
export const loopContextSchema = z.object({
  loopNodeId: z.string().describe("ID of the loop node"),

  iterationIndex: z
    .number()
    .describe("Zero-based index of the current iteration"),

  iterationKey: z
    .string()
    .optional()
    .describe("Key identifier for the current item (e.g., object ID)"),

  totalIterations: z
    .number()
    .optional()
    .describe("Total number of iterations if known"),
});
export type LoopContext = z.infer<typeof loopContextSchema>;

/**
 * Execution state for a single node within a workflow execution
 *
 * Tracks the lifecycle of a node's execution including timing,
 * input/output data, errors, and retry information.
 */
export const nodeExecutionStateSchema = z.object({
  id: z
    .string()
    .describe("Unique identifier for this node execution record"),

  executionId: z
    .string()
    .describe("Reference to the parent execution record"),

  nodeId: z
    .string()
    .describe("Reference to the node in the workflow snapshot"),

  status: nodeExecutionStatusSchema.describe("Current execution status of this node"),

  startedAt: z
    .number()
    .optional()
    .describe("Unix timestamp in milliseconds when node execution started"),

  completedAt: z
    .number()
    .optional()
    .describe("Unix timestamp in milliseconds when node execution completed"),

  duration: z
    .number()
    .optional()
    .describe("Node execution duration in milliseconds"),

  input: z
    .unknown()
    .optional()
    .describe("Resolved input data passed to the node"),

  output: z.unknown().optional().describe("Output data produced by the node"),

  error: nodeErrorSchema
    .optional()
    .describe("Error information if node execution failed"),

  attempt: z
    .number()
    .default(1)
    .describe("Current attempt number (1-based, increments on retry)"),

  maxAttempts: z
    .number()
    .optional()
    .describe("Maximum retry attempts configured for this node"),

  loopContext: loopContextSchema
    .optional()
    .describe("Loop iteration context if node is inside a loop"),
});
export type NodeExecutionState = z.infer<typeof nodeExecutionStateSchema>;
