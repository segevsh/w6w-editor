import { z } from "zod";
import { transitionScopeSchema } from "./status";

/**
 * State transition event record
 *
 * Captures every state change during workflow execution for
 * debugging, audit trails, and potential replay functionality.
 */
export const stateTransitionSchema = z.object({
  id: z.number().optional().describe("Auto-incrementing ID for ordering"),

  executionId: z
    .string()
    .describe("Reference to the parent execution record"),

  timestamp: z
    .number()
    .describe("Unix timestamp in milliseconds when the transition occurred"),

  scope: transitionScopeSchema.describe(
    "Whether this is an execution-level or node-level transition"
  ),

  nodeId: z
    .string()
    .optional()
    .describe("Node ID if this is a node-level transition"),

  fromState: z.string().describe("Previous state before the transition"),

  toState: z.string().describe("New state after the transition"),

  reason: z
    .string()
    .optional()
    .describe("Human-readable reason for the transition"),

  data: z
    .unknown()
    .optional()
    .describe("Additional context data for the transition"),
});
export type StateTransition = z.infer<typeof stateTransitionSchema>;
