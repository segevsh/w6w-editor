import { type FC, memo, useMemo } from 'react';
import { Handle, Position, type NodeProps as XYNodeProps } from '@xyflow/react';
import { AppLabel } from '../ui/AppLabel';
import { NodeActionToolbar } from '../ui/NodeActionToolbar';
import { NodeExecutionBadge } from '../ui/NodeExecutionBadge';
import type { WorkflowNodeData, WorkflowNodeType, NodeExecutionStatus } from '../../types/node';
import { getNodeType } from '../../types/node';

// Re-export types for public API consumers
export type { WorkflowNodeData, WorkflowNodeType };

const handleStyle = {
  background: '#555',
  width: '8px',
  height: '8px',
  border: '2px solid #fff',
};

/**
 * Get border color based on execution status
 */
function getExecutionBorderColor(status?: NodeExecutionStatus): string | undefined {
  switch (status) {
    case 'running':
      return '#2196f3'; // blue
    case 'completed':
      return '#4caf50'; // green
    case 'failed':
      return '#f44336'; // red
    case 'skipped':
      return '#9e9e9e'; // gray
    case 'cancelled':
      return '#ff9800'; // orange
    case 'queued':
      return '#9c27b0'; // purple
    default:
      return undefined;
  }
}

/**
 * Format duration in human-readable format
 */
function formatDuration(ms?: number): string | undefined {
  if (ms === undefined) return undefined;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * WorkflowNode - A custom React Flow node that renders dynamic input/output handles
 * based on the node's data.input and data.output arrays
 *
 * Supports execution mode with visual status indicators:
 * - Running: Blue pulsing border
 * - Completed: Green border with checkmark badge
 * - Failed: Red border with error badge
 * - Skipped: Gray border
 */
export const WorkflowNode: FC<XYNodeProps<WorkflowNodeType>> = memo(({ id, data, selected }) => {
  const inputs = data.input || [];
  const outputs = data.output || [];
  const isExecutionMode = data.isExecutionMode || false;
  const executionStatus = data.executionStatus;
  const nodeType = getNodeType(data);
  const isTrigger = nodeType === 'trigger';

  // Calculate handle positions for inputs (left side)
  // Triggers don't have input handles (they are the start of a workflow)
  const inputHandles = useMemo(() => {
    if (isTrigger) {
      return []; // No input handles for triggers
    }
    if (inputs.length === 0) {
      // Default single input handle
      return [{ id: undefined, top: '50%' }];
    }
    return inputs.map((id, index) => ({
      id,
      top: `${((index + 1) / (inputs.length + 1)) * 100}%`,
    }));
  }, [inputs, isTrigger]);

  // Calculate handle positions for outputs (right side)
  const outputHandles = useMemo(() => {
    if (outputs.length === 0) {
      // Default single output handle
      return [{ id: undefined, top: '50%' }];
    }
    return outputs.map((id, index) => ({
      id,
      top: `${((index + 1) / (outputs.length + 1)) * 100}%`,
    }));
  }, [outputs]);

  // Get background color based on node type
  const getNodeColor = () => {
    switch (nodeType) {
      case 'trigger':
        return '#e3f2fd';
      case 'condition':
        return '#fff3e0';
      case 'action':
        return '#e8f5e9';
      case 'transform':
        return '#f3e5f5';
      case 'loop':
        return '#fce4ec';
      default:
        return '#f5f5f5';
    }
  };

  // Determine border style based on execution status
  const executionBorderColor = getExecutionBorderColor(executionStatus);
  const isRunning = executionStatus === 'running';

  // Build CSS class names
  const nodeClassNames = [
    'workflow-node',
    isExecutionMode ? 'execution-mode' : '',
    executionStatus ? `execution-status-${executionStatus}` : '',
    isRunning ? 'execution-running' : '',
  ].filter(Boolean).join(' ');

  // Handle click during execution mode
  const handleNodeClick = () => {
    if (isExecutionMode && data.onViewExecutionDetails) {
      data.onViewExecutionDetails(id);
    }
  };

  return (
    <div
      className={nodeClassNames}
      onClick={handleNodeClick}
      style={{
        position: 'relative',
        padding: '10px 20px',
        borderRadius: '8px',
        background: getNodeColor(),
        border: executionBorderColor ? `2px solid ${executionBorderColor}` : 'none',
        minWidth: '120px',
        minHeight: `${Math.max(40, Math.max(inputs.length, outputs.length) * 25)}px`,
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'left',
        boxShadow: selected
          ? '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
          : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        opacity: data.disabled ? 0.5 : 1,
        cursor: isExecutionMode ? 'pointer' : undefined,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Execution status badge (shown in execution mode) */}
      {isExecutionMode && executionStatus && (
        <NodeExecutionBadge
          status={executionStatus}
          duration={formatDuration(data.executionDuration)}
          error={data.executionError}
        />
      )}

      {/* Action toolbar (shown when selected AND not in execution mode) */}
      {selected && !isExecutionMode && (data.onDelete || data.onEdit || data.onDuplicate) && (
        <NodeActionToolbar
          nodeId={id}
          onDelete={data.onDelete}
          onEdit={data.onEdit}
          onDuplicate={data.onDuplicate}
        />
      )}

      {/* Input handles (left side) */}
      {inputHandles.map((handle) => (
        <Handle
          key={handle.id || 'default-input'}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{
            ...handleStyle,
            top: handle.top,
          }}
        />
      ))}

      {/* Node content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '4px',
        }}
      >
        {/* App label (first row) */}
        {data.appName && (
          <AppLabel
            icon={data.appIcon}
            name={data.appName}
            version={data.appVersion}
            fontSize={8}
          />
        )}
        {/* Node label (second row) */}
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            textAlign: 'center',
            color: '#333',
          }}
        >
          {data.label || 'Node'}
        </div>
      </div>

      {/* Output handles (right side) */}
      {outputHandles.map((handle) => (
        <Handle
          key={handle.id || 'default-output'}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            ...handleStyle,
            top: handle.top,
          }}
        />
      ))}

      {/* Add node buttons (hidden in execution mode, left button hidden for triggers) */}
      {!isExecutionMode && !isTrigger && data.onAddNode && !data.hasInputConnection && (
        <button
          className="add-node-button add-node-button-left"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Add node button clicked (left/target)', id);
            data.onAddNode?.(id, 'target');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="Add node before"
          aria-label="Add node before"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
      {!isExecutionMode && data.onAddNode && !data.hasOutputConnection && (
        <button
          className="add-node-button add-node-button-right"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Add node button clicked (right/source)', id);
            data.onAddNode?.(id, 'source');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="Add node after"
          aria-label="Add node after"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
