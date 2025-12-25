import { z } from "zod";
import { idSchema } from "../id";
import { CONSTS } from "../consts";
import { nodeSchema } from "../node";
import { edgeSchema } from "../edge";
import { executionStatusSchema, triggerTypeSchema } from "./status";
import { executionErrorSchema } from "./errors";

/**
 * Snapshot of workflow structure at execution time
 *
 * This captures the complete workflow definition as it existed
 * when the execution started, allowing for accurate replay and debugging
 * even if the workflow is later modified.
 */
export const workflowSnapshotSchema = z.object({
  nodes: z.array(nodeSchema).describe("All nodes with their configurations"),

  edges: z.array(edgeSchema).describe("All connections between nodes"),

  triggers: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe("Trigger definitions"),

  variables: z
    .array(
      z.object({
        name: z.string(),
        type: z.string().optional(),
      })
    )
    .optional()
    .describe("Variable definitions (not values)"),
});
export type WorkflowSnapshot = z.infer<typeof workflowSnapshotSchema>;

/**
 * Context about what triggered the execution
 */
export const triggerContextSchema = z.object({
  type: triggerTypeSchema.describe("How the execution was triggered"),

  triggeredBy: z
    .string()
    .optional()
    .describe("User ID or system identifier that triggered the execution"),

  triggerData: z
    .unknown()
    .optional()
    .describe("Payload data from webhook, API call, or event"),

  scheduledTime: z
    .number()
    .optional()
    .describe("Scheduled time if triggered by scheduler (Unix ms)"),
});
export type TriggerContext = z.infer<typeof triggerContextSchema>;

/**
 * Complete execution record for a workflow run
 *
 * This is the primary schema for tracking workflow executions,
 * including the workflow snapshot, status, timing, and results.
 */
export const executionRecordSchema = z.object({
  executionId: idSchema(CONSTS.idPrefix.execution).describe(
    "Unique execution identifier"
  ),

  workflowId: idSchema(CONSTS.idPrefix.workflow).describe(
    "Reference to the source workflow"
  ),

  workflowSnapshot: workflowSnapshotSchema.describe(
    "Frozen workflow state at execution time"
  ),

  status: executionStatusSchema.describe("Current execution status"),

  startedAt: z
    .number()
    .describe("Unix timestamp in milliseconds when execution started"),

  completedAt: z
    .number()
    .optional()
    .describe("Unix timestamp in milliseconds when execution completed"),

  duration: z
    .number()
    .optional()
    .describe("Total execution duration in milliseconds"),

  error: executionErrorSchema
    .optional()
    .describe("Error information if execution failed"),

  triggerContext: triggerContextSchema.describe(
    "Context about what triggered the execution"
  ),

  inputVars: z
    .record(z.string(), z.unknown())
    .default({})
    .describe("Resolved input variables at execution start"),

  outputData: z.unknown().optional().describe("Final workflow output data"),

  createdAt: z
    .string()
    .datetime()
    .optional()
    .describe("Database record creation timestamp"),

  updatedAt: z
    .string()
    .datetime()
    .optional()
    .describe("Database record last update timestamp"),
});
export type ExecutionRecord = z.infer<typeof executionRecordSchema>;
