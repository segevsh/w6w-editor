import { type FC, memo } from 'react';
import type { NodeExecutionStatus } from '../../types/node';

interface NodeExecutionBadgeProps {
  status: NodeExecutionStatus;
  duration?: string;
  error?: string;
}

/**
 * Get the icon SVG for each execution status
 */
function getStatusIcon(status: NodeExecutionStatus) {
  switch (status) {
    case 'running':
      return (
        <svg className="execution-badge-spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="31.416" strokeDashoffset="10" />
        </svg>
      );
    case 'completed':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case 'failed':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'skipped':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case 'cancelled':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'queued':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case 'pending':
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

/**
 * Get badge background color based on status
 */
function getBadgeColor(status: NodeExecutionStatus): string {
  switch (status) {
    case 'running':
      return '#2196f3';
    case 'completed':
      return '#4caf50';
    case 'failed':
      return '#f44336';
    case 'skipped':
      return '#9e9e9e';
    case 'cancelled':
      return '#ff9800';
    case 'queued':
      return '#9c27b0';
    default:
      return '#757575';
  }
}

/**
 * NodeExecutionBadge - Visual indicator for node execution status
 *
 * Shows a badge above the node with:
 * - Status icon (spinner for running, checkmark for completed, etc.)
 * - Duration (if completed)
 * - Error tooltip (if failed)
 */
export const NodeExecutionBadge: FC<NodeExecutionBadgeProps> = memo(({ status, duration, error }) => {
  const bgColor = getBadgeColor(status);
  const showDuration = (status === 'completed' || status === 'failed') && duration;

  return (
    <div
      className="node-execution-badge"
      title={error || undefined}
      style={{
        position: 'absolute',
        top: '-24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '12px',
        background: bgColor,
        color: 'white',
        fontSize: '10px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
    >
      {getStatusIcon(status)}
      {showDuration && <span>{duration}</span>}
      {status === 'failed' && error && (
        <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Error
        </span>
      )}
    </div>
  );
});

NodeExecutionBadge.displayName = 'NodeExecutionBadge';
