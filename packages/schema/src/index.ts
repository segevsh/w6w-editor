// Core schemas
export { nodeSchema, nodeTypeEnum, actionType } from "./node";
export type { Node } from "./node";

export { connectionSchema } from "./connection";
export type { Connection } from "./connection";

export { workflowSchema } from "./workflow";
export type { Workflow } from "./workflow";

export { edgeSchema } from "./edge";
export type { Edge } from "./edge";

export { variableSchema } from "./variable";
export type { Variable } from "./variable";

export { propertySchema, editorOptionsSchema } from "./property";
export type { Property, EditorOptions } from "./property";

export {
  credentialSchema,
  oauth2ClaimsSchema,
  oauth2ConfigSchema,
  apiTokenConfigSchema,
  authMethodSchema,
} from "./credentials";
export type {
  Credential,
  OAuth2Claims,
  OAuth2Config,
  ApiTokenConfig,
  AuthMethod
} from "./credentials";

export {
  executionLogSchema,
  executionLogEntrySchema,
  logLevelSchema,
} from "./execution-log";
export type {
  ExecutionLog,
  ExecutionLogEntry,
  LogLevel
} from "./execution-log";

// Execution schemas (comprehensive execution state tracking)
export {
  // Status enums
  executionStatusSchema,
  nodeExecutionStatusSchema,
  triggerTypeSchema,
  transitionScopeSchema,
  // Error schemas
  executionErrorSchema,
  nodeErrorSchema,
  // Execution record schemas
  workflowSnapshotSchema,
  triggerContextSchema,
  executionRecordSchema,
  // Node execution schemas
  loopContextSchema,
  nodeExecutionStateSchema,
  // State transition schemas
  stateTransitionSchema,
} from "./execution";
export type {
  // Status types
  ExecutionStatus,
  NodeExecutionStatus,
  TriggerType,
  TransitionScope,
  // Error types
  ExecutionError,
  NodeError,
  // Execution record types
  WorkflowSnapshot,
  TriggerContext,
  ExecutionRecord,
  // Node execution types
  LoopContext,
  NodeExecutionState,
  // State transition types
  StateTransition,
} from "./execution";

// Action and App schemas
export {
  actionDefinitionSchema,
  actionCategoryEnum,
  restConfigSchema
} from "./action";
export type {
  ActionDefinition,
  RestConfig,
  Action,
  ExecutionContext,
  ExecuteParams,
  ExecuteResult
} from "./action";

export { appDefinitionSchema } from "./app";
export type { AppDefinition } from "./app";

export { packageDefinitionSchema } from "./package";

// Utility schemas
export { idSchema } from "./id";
export { positionSchema } from "./position";
export { CONSTS } from "./consts";
