import { useState, useCallback, useRef, useEffect } from 'react';
import type { NodeExecutionStatus } from '../types/node';

/**
 * Execution status for the entire workflow
 */
export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Node execution state map
 */
export interface NodeExecutionState {
  status: NodeExecutionStatus;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
  error?: string;
  output?: unknown;
}

/**
 * Execution state for the workflow
 */
export interface ExecutionState {
  executionId: string | null;
  status: ExecutionStatus;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
  error?: string;
  nodeStates: Record<string, NodeExecutionState>;
}

/**
 * Execution event from the API
 */
export interface ExecutionEventData {
  type: 'execution_started' | 'node_started' | 'node_completed' | 'node_failed' | 'execution_completed' | 'execution_failed';
  executionId: string;
  workflowId?: string;
  nodeId?: string;
  nodeCount?: number;
  output?: unknown;
  error?: {
    message: string;
    stack?: string;
    nodeId?: string;
  };
  duration?: number;
  timestamp: number;
}

/**
 * Options for the useExecutionState hook
 */
export interface UseExecutionStateOptions {
  /**
   * Polling interval in milliseconds (default: 1000)
   */
  pollingInterval?: number;
  /**
   * API base URL for fetching execution state
   */
  apiBaseUrl?: string;
  /**
   * Callback when execution starts
   */
  onExecutionStart?: (executionId: string) => void;
  /**
   * Callback when a node starts executing
   */
  onNodeStart?: (nodeId: string) => void;
  /**
   * Callback when a node completes
   */
  onNodeComplete?: (nodeId: string, output: unknown) => void;
  /**
   * Callback when a node fails
   */
  onNodeFail?: (nodeId: string, error: string) => void;
  /**
   * Callback when execution completes
   */
  onExecutionComplete?: (output: unknown) => void;
  /**
   * Callback when execution fails
   */
  onExecutionFail?: (error: string) => void;
}

const initialState: ExecutionState = {
  executionId: null,
  status: 'idle',
  nodeStates: {},
};

/**
 * Hook for managing workflow execution state
 *
 * This hook provides:
 * - State tracking for execution and individual nodes
 * - Polling for updates from the API
 * - Event processing for real-time updates
 * - Callbacks for state changes
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   isExecuting,
 *   startExecution,
 *   processEvent,
 *   reset,
 *   getNodeState,
 * } = useExecutionState({
 *   pollingInterval: 1000,
 *   onNodeComplete: (nodeId) => console.log(`Node ${nodeId} completed`),
 * });
 *
 * // Start execution
 * await startExecution('wf_abc123', { triggerType: 'manual' });
 *
 * // Get node states for rendering
 * const nodeState = getNodeState('node_1');
 * ```
 */
export function useExecutionState(options: UseExecutionStateOptions = {}) {
  const {
    pollingInterval = 1000,
    apiBaseUrl = '/api',
    onExecutionStart,
    onNodeStart,
    onNodeComplete,
    onNodeFail,
    onExecutionComplete,
    onExecutionFail,
  } = options;

  const [state, setState] = useState<ExecutionState>(initialState);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Process an execution event
   */
  const processEvent = useCallback((event: ExecutionEventData) => {
    setState((prev) => {
      const newState = { ...prev };

      switch (event.type) {
        case 'execution_started':
          newState.status = 'running';
          newState.startedAt = event.timestamp;
          onExecutionStart?.(event.executionId);
          break;

        case 'node_started':
          if (event.nodeId) {
            newState.nodeStates = {
              ...prev.nodeStates,
              [event.nodeId]: {
                status: 'running',
                startedAt: event.timestamp,
              },
            };
            onNodeStart?.(event.nodeId);
          }
          break;

        case 'node_completed':
          if (event.nodeId) {
            newState.nodeStates = {
              ...prev.nodeStates,
              [event.nodeId]: {
                ...prev.nodeStates[event.nodeId],
                status: 'completed',
                completedAt: event.timestamp,
                duration: event.duration,
                output: event.output,
              },
            };
            onNodeComplete?.(event.nodeId, event.output);
          }
          break;

        case 'node_failed':
          if (event.nodeId) {
            newState.nodeStates = {
              ...prev.nodeStates,
              [event.nodeId]: {
                ...prev.nodeStates[event.nodeId],
                status: 'failed',
                completedAt: event.timestamp,
                duration: event.duration,
                error: event.error?.message,
              },
            };
            onNodeFail?.(event.nodeId, event.error?.message || 'Unknown error');
          }
          break;

        case 'execution_completed':
          newState.status = 'completed';
          newState.completedAt = event.timestamp;
          newState.duration = event.duration;
          onExecutionComplete?.(event.output);
          break;

        case 'execution_failed':
          newState.status = 'failed';
          newState.completedAt = event.timestamp;
          newState.duration = event.duration;
          newState.error = event.error?.message;
          onExecutionFail?.(event.error?.message || 'Unknown error');
          break;
      }

      return newState;
    });
  }, [onExecutionStart, onNodeStart, onNodeComplete, onNodeFail, onExecutionComplete, onExecutionFail]);

  /**
   * Fetch execution state from API
   */
  const fetchExecutionState = useCallback(async (executionId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/executions/${executionId}?includeNodes=true`, {
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) return;

      const data = await response.json();
      if (!data.success) return;

      const execution = data.data;

      setState((prev) => ({
        ...prev,
        executionId: execution.executionId,
        status: execution.status === 'running' ? 'running' :
                execution.status === 'completed' ? 'completed' :
                execution.status === 'failed' ? 'failed' :
                execution.status === 'cancelled' ? 'cancelled' : 'idle',
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        duration: execution.duration,
        error: execution.error?.message,
        nodeStates: (execution.nodeExecutions || []).reduce((acc: Record<string, NodeExecutionState>, node: any) => {
          acc[node.nodeId] = {
            status: node.status,
            startedAt: node.startedAt,
            completedAt: node.completedAt,
            duration: node.duration,
            error: node.error?.message,
            output: node.output,
          };
          return acc;
        }, {}),
      }));

      // Stop polling if execution is complete
      if (execution.status !== 'running' && execution.status !== 'pending') {
        stopPolling();
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to fetch execution state:', error);
      }
    }
  }, [apiBaseUrl]);

  /**
   * Start polling for updates
   */
  const startPolling = useCallback((executionId: string) => {
    stopPolling();
    abortControllerRef.current = new AbortController();

    // Initial fetch
    fetchExecutionState(executionId);

    // Set up polling
    pollingRef.current = setInterval(() => {
      fetchExecutionState(executionId);
    }, pollingInterval);
  }, [fetchExecutionState, pollingInterval]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Start a new execution
   */
  const startExecution = useCallback(async (
    workflowId: string,
    options?: {
      vars?: Record<string, unknown>;
      triggerType?: 'manual' | 'api';
      triggeredBy?: string;
    }
  ) => {
    try {
      const response = await fetch(`${apiBaseUrl}/executions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          vars: options?.vars,
          triggerType: options?.triggerType || 'manual',
          triggeredBy: options?.triggeredBy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start execution');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to start execution');
      }

      const executionId = data.data.executionId;

      setState({
        executionId,
        status: 'running',
        startedAt: Date.now(),
        nodeStates: {},
      });

      // Start polling for updates
      startPolling(executionId);

      return executionId;
    } catch (error) {
      console.error('Failed to start execution:', error);
      throw error;
    }
  }, [apiBaseUrl, startPolling]);

  /**
   * Reset execution state
   */
  const reset = useCallback(() => {
    stopPolling();
    setState(initialState);
  }, [stopPolling]);

  /**
   * Get state for a specific node
   */
  const getNodeState = useCallback((nodeId: string): NodeExecutionState | undefined => {
    return state.nodeStates[nodeId];
  }, [state.nodeStates]);

  /**
   * Check if execution is in progress
   */
  const isExecuting = state.status === 'running';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    state,
    isExecuting,
    startExecution,
    processEvent,
    reset,
    getNodeState,
    startPolling,
    stopPolling,
  };
}

export type { NodeExecutionStatus };
