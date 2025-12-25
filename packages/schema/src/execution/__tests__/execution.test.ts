import { describe, it, expect } from "vitest";
import {
  executionStatusSchema,
  nodeExecutionStatusSchema,
  triggerTypeSchema,
  executionErrorSchema,
  nodeErrorSchema,
  executionRecordSchema,
  nodeExecutionStateSchema,
  stateTransitionSchema,
  loopContextSchema,
  triggerContextSchema,
  workflowSnapshotSchema,
} from "../index";

describe("Status Schemas", () => {
  describe("executionStatusSchema", () => {
    it("accepts valid execution statuses", () => {
      expect(() => executionStatusSchema.parse("pending")).not.toThrow();
      expect(() => executionStatusSchema.parse("running")).not.toThrow();
      expect(() => executionStatusSchema.parse("completed")).not.toThrow();
      expect(() => executionStatusSchema.parse("failed")).not.toThrow();
      expect(() => executionStatusSchema.parse("cancelled")).not.toThrow();
      expect(() => executionStatusSchema.parse("timeout")).not.toThrow();
    });

    it("rejects invalid statuses", () => {
      expect(() => executionStatusSchema.parse("invalid")).toThrow();
      expect(() => executionStatusSchema.parse("")).toThrow();
      expect(() => executionStatusSchema.parse(123)).toThrow();
    });
  });

  describe("nodeExecutionStatusSchema", () => {
    it("accepts valid node execution statuses", () => {
      expect(() => nodeExecutionStatusSchema.parse("pending")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("queued")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("running")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("completed")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("failed")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("skipped")).not.toThrow();
      expect(() => nodeExecutionStatusSchema.parse("cancelled")).not.toThrow();
    });

    it("rejects invalid statuses", () => {
      expect(() => nodeExecutionStatusSchema.parse("timeout")).toThrow();
      expect(() => nodeExecutionStatusSchema.parse("unknown")).toThrow();
    });
  });

  describe("triggerTypeSchema", () => {
    it("accepts valid trigger types", () => {
      expect(() => triggerTypeSchema.parse("manual")).not.toThrow();
      expect(() => triggerTypeSchema.parse("scheduled")).not.toThrow();
      expect(() => triggerTypeSchema.parse("webhook")).not.toThrow();
      expect(() => triggerTypeSchema.parse("api")).not.toThrow();
      expect(() => triggerTypeSchema.parse("event")).not.toThrow();
    });
  });
});

describe("Error Schemas", () => {
  describe("executionErrorSchema", () => {
    it("validates complete error object", () => {
      const error = {
        message: "Something went wrong",
        code: "ERR_NETWORK",
        nodeId: "nd_abc123",
        stack: "Error: Something went wrong\n    at...",
        timestamp: Date.now(),
      };
      expect(() => executionErrorSchema.parse(error)).not.toThrow();
    });

    it("requires message and timestamp", () => {
      expect(() =>
        executionErrorSchema.parse({ message: "Error" })
      ).toThrow();
      expect(() =>
        executionErrorSchema.parse({ timestamp: Date.now() })
      ).toThrow();
    });

    it("accepts minimal error", () => {
      const error = {
        message: "Minimal error",
        timestamp: 1234567890,
      };
      expect(() => executionErrorSchema.parse(error)).not.toThrow();
    });
  });

  describe("nodeErrorSchema", () => {
    it("validates complete node error", () => {
      const error = {
        message: "Node failed",
        code: "ERR_TIMEOUT",
        stack: "Error stack...",
        retryable: true,
      };
      expect(() => nodeErrorSchema.parse(error)).not.toThrow();
    });

    it("defaults retryable to false", () => {
      const error = { message: "Error" };
      const parsed = nodeErrorSchema.parse(error);
      expect(parsed.retryable).toBe(false);
    });
  });
});

describe("ExecutionRecord Schema", () => {
  const validRecord = {
    executionId: "ex_abc123",
    workflowId: "wf_xyz789",
    workflowSnapshot: { nodes: [], edges: [] },
    status: "running",
    startedAt: Date.now(),
    triggerContext: { type: "manual" },
  };

  it("validates complete execution record", () => {
    expect(() => executionRecordSchema.parse(validRecord)).not.toThrow();
  });

  it("requires execution ID with correct prefix", () => {
    expect(() =>
      executionRecordSchema.parse({
        ...validRecord,
        executionId: "invalid_123",
      })
    ).toThrow();

    expect(() =>
      executionRecordSchema.parse({
        ...validRecord,
        executionId: "ex123", // missing underscore
      })
    ).toThrow();
  });

  it("requires workflow ID with correct prefix", () => {
    expect(() =>
      executionRecordSchema.parse({
        ...validRecord,
        workflowId: "invalid_123",
      })
    ).toThrow();
  });

  it("defaults inputVars to empty object", () => {
    const parsed = executionRecordSchema.parse(validRecord);
    expect(parsed.inputVars).toEqual({});
  });

  it("accepts optional fields as undefined", () => {
    const parsed = executionRecordSchema.parse(validRecord);
    expect(parsed.completedAt).toBeUndefined();
    expect(parsed.duration).toBeUndefined();
    expect(parsed.error).toBeUndefined();
    expect(parsed.outputData).toBeUndefined();
  });

  it("validates with all optional fields", () => {
    const fullRecord = {
      ...validRecord,
      status: "completed",
      completedAt: Date.now() + 1000,
      duration: 1000,
      error: {
        message: "Some error",
        timestamp: Date.now(),
      },
      inputVars: { foo: "bar" },
      outputData: { result: "success" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(() => executionRecordSchema.parse(fullRecord)).not.toThrow();
  });
});

describe("NodeExecutionState Schema", () => {
  const validState = {
    id: "ex_abc123_nd_xyz_1",
    executionId: "ex_abc123",
    nodeId: "nd_xyz789",
    status: "completed",
  };

  it("validates complete node execution state", () => {
    expect(() => nodeExecutionStateSchema.parse(validState)).not.toThrow();
  });

  it("defaults attempt to 1", () => {
    const parsed = nodeExecutionStateSchema.parse(validState);
    expect(parsed.attempt).toBe(1);
  });

  it("validates with all fields", () => {
    const fullState = {
      ...validState,
      startedAt: Date.now(),
      completedAt: Date.now() + 100,
      duration: 100,
      input: { data: "input" },
      output: { result: "output" },
      error: { message: "Failed", retryable: true },
      attempt: 2,
      maxAttempts: 3,
      loopContext: {
        loopNodeId: "nd_loop1",
        iterationIndex: 5,
        iterationKey: "item_5",
        totalIterations: 10,
      },
    };
    expect(() => nodeExecutionStateSchema.parse(fullState)).not.toThrow();
  });
});

describe("StateTransition Schema", () => {
  it("validates execution-level transition", () => {
    const transition = {
      executionId: "ex_abc123",
      timestamp: Date.now(),
      scope: "execution",
      fromState: "pending",
      toState: "running",
    };
    expect(() => stateTransitionSchema.parse(transition)).not.toThrow();
  });

  it("validates node-level transition", () => {
    const transition = {
      executionId: "ex_abc123",
      timestamp: Date.now(),
      scope: "node",
      nodeId: "nd_xyz789",
      fromState: "running",
      toState: "completed",
      reason: "Node completed successfully",
      data: { outputSize: 1024 },
    };
    expect(() => stateTransitionSchema.parse(transition)).not.toThrow();
  });
});

describe("LoopContext Schema", () => {
  it("validates minimal loop context", () => {
    const context = {
      loopNodeId: "nd_loop1",
      iterationIndex: 0,
    };
    expect(() => loopContextSchema.parse(context)).not.toThrow();
  });

  it("validates complete loop context", () => {
    const context = {
      loopNodeId: "nd_loop1",
      iterationIndex: 5,
      iterationKey: "user_123",
      totalIterations: 100,
    };
    expect(() => loopContextSchema.parse(context)).not.toThrow();
  });
});

describe("TriggerContext Schema", () => {
  it("validates manual trigger", () => {
    const context = { type: "manual" };
    expect(() => triggerContextSchema.parse(context)).not.toThrow();
  });

  it("validates webhook trigger with data", () => {
    const context = {
      type: "webhook",
      triggeredBy: "webhook_endpoint_1",
      triggerData: { body: { event: "user.created" } },
    };
    expect(() => triggerContextSchema.parse(context)).not.toThrow();
  });

  it("validates scheduled trigger", () => {
    const context = {
      type: "scheduled",
      scheduledTime: Date.now(),
    };
    expect(() => triggerContextSchema.parse(context)).not.toThrow();
  });
});

describe("WorkflowSnapshot Schema", () => {
  it("validates empty snapshot", () => {
    const snapshot = { nodes: [], edges: [] };
    expect(() => workflowSnapshotSchema.parse(snapshot)).not.toThrow();
  });

  it("validates snapshot with variables", () => {
    const snapshot = {
      nodes: [],
      edges: [],
      variables: [{ name: "apiKey", type: "string" }],
    };
    expect(() => workflowSnapshotSchema.parse(snapshot)).not.toThrow();
  });
});
