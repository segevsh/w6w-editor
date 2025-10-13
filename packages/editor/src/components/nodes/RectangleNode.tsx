import { type FC, memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Rectangle } from '../elements/Rectangle';

export interface RectangleNodeData {
  label?: string;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  labelColor?: string;
  labelSize?: number;
}

/**
 * RectangleNode - A custom React Flow node that uses the Rectangle component
 */
export const RectangleNode: FC<NodeProps<RectangleNodeData>> = memo(({ data, selected }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#555',
          width: '8px',
          height: '8px',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#555',
          width: '8px',
          height: '8px',
        }}
      />

      {/* Rectangle component */}
      <Rectangle
        width={data.width}
        height={data.height}
        fill={data.fill}
        stroke={data.stroke}
        strokeWidth={data.strokeWidth}
        borderRadius={data.borderRadius}
        label={data.label}
        labelColor={data.labelColor}
        labelSize={data.labelSize}
        selected={selected}
      />

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#555',
          width: '8px',
          height: '8px',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#555',
          width: '8px',
          height: '8px',
        }}
      />
    </div>
  );
});

RectangleNode.displayName = 'RectangleNode';
