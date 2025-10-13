import { type FC, type CSSProperties } from 'react';

export interface NodeProps {
  /**
   * Width of the node in pixels
   */
  width?: number;
  /**
   * Height of the node in pixels
   */
  height?: number;
  /**
   * Background color of the node
   */
  backgroundColor?: string;
  /**
   * Border color
   */
  borderColor?: string;
  /**
   * Border width in pixels
   */
  borderWidth?: number;
  /**
   * Border radius in pixels
   */
  borderRadius?: number;
  /**
   * Node title/label
   */
  title?: string;
  /**
   * Node description or subtitle
   */
  description?: string;
  /**
   * Whether the node is selected
   */
  selected?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show connection handles/connectors
   */
  showConnectors?: boolean;
  /**
   * Color of the connector handles
   */
  connectorColor?: string;
  /**
   * Which sides to show connectors on
   */
  connectorSides?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

/**
 * Node - A basic workflow node shape component
 *
 * @example
 * ```tsx
 * <Node
 *   width={200}
 *   height={100}
 *   backgroundColor="#ffffff"
 *   borderColor="#0066cc"
 *   title="Process Step"
 *   description="Handles data processing"
 * />
 * ```
 */
export const Node: FC<NodeProps> = ({
  width = 200,
  height = 100,
  backgroundColor = '#ffffff',
  borderColor = '#0066cc',
  borderWidth = 2,
  borderRadius = 8,
  title,
  description,
  selected = false,
  onClick,
  className = '',
  showConnectors = false,
  connectorColor = '#666666',
  connectorSides = { top: true, right: true, bottom: true, left: true },
}) => {
  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: `${width}px`,
    minHeight: `${height}px`,
    backgroundColor,
    border: `${borderWidth}px solid ${borderColor}`,
    borderRadius: `${borderRadius}px`,
    padding: '12px 16px',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    boxShadow: selected
      ? `0 0 0 3px ${borderColor}40`
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const titleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: description ? '4px' : '0',
    width: '100%',
  };

  const descriptionStyle: CSSProperties = {
    fontSize: '12px',
    fontWeight: 400,
    color: '#666666',
    lineHeight: '1.4',
    width: '100%',
  };

  const connectorBaseStyle: CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: connectorColor,
    border: '2px solid #ffffff',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  };

  const connectorStyles = {
    top: {
      ...connectorBaseStyle,
      top: '-5px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    right: {
      ...connectorBaseStyle,
      top: '50%',
      right: '-5px',
      transform: 'translateY(-50%)',
    },
    bottom: {
      ...connectorBaseStyle,
      bottom: '-5px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      ...connectorBaseStyle,
      top: '50%',
      left: '-5px',
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div style={wrapperStyle} className={`w6w-node-wrapper ${className}`}>
      <div
        className="w6w-node"
        style={containerStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {title && <div style={titleStyle}>{title}</div>}
        {description && <div style={descriptionStyle}>{description}</div>}
      </div>

      {/* Connection Handles */}
      {showConnectors && (
        <>
          {connectorSides.top && <div style={connectorStyles.top} className="w6w-connector w6w-connector-top" />}
          {connectorSides.right && <div style={connectorStyles.right} className="w6w-connector w6w-connector-right" />}
          {connectorSides.bottom && <div style={connectorStyles.bottom} className="w6w-connector w6w-connector-bottom" />}
          {connectorSides.left && <div style={connectorStyles.left} className="w6w-connector w6w-connector-left" />}
        </>
      )}
    </div>
  );
};
