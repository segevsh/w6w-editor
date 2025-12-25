import { z } from "zod";

/**
 * Execution status for the overall workflow execution
 */
export const executionStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
  "timeout",
]);
export type ExecutionStatus = z.infer<typeof executionStatusSchema>;

/**
 * Execution status for individual node executions
 */
export const nodeExecutionStatusSchema = z.enum([
  "pending",
  "queued",
  "running",
  "completed",
  "failed",
  "skipped",
  "cancelled",
]);
export type NodeExecutionStatus = z.infer<typeof nodeExecutionStatusSchema>;

/**
 * Trigger type that initiated the execution
 */
export const triggerTypeSchema = z.enum([
  "manual",
  "scheduled",
  "webhook",
  "api",
  "event",
]);
export type TriggerType = z.infer<typeof triggerTypeSchema>;

/**
 * Scope of a state transition (execution-level or node-level)
 */
export const transitionScopeSchema = z.enum(["execution", "node"]);
export type TransitionScope = z.infer<typeof transitionScopeSchema>;
