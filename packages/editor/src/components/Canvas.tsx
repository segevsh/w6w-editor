import { type FC, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export interface CanvasProps {
  /**
   * Initial nodes on the canvas
   */
  initialNodes?: Node[];
  /**
   * Initial edges on the canvas
   */
  initialEdges?: Edge[];
  /**
   * Callback when nodes or edges change
   */
  onChange?: (nodes: Node[], edges: Edge[]) => void;
  /**
   * Height of the canvas
   * @default '600px'
   */
  height?: string;
  /**
   * Whether to show the minimap
   * @default true
   */
  showMiniMap?: boolean;
  /**
   * Whether to show the controls
   * @default true
   */
  showControls?: boolean;
  /**
   * Whether to show the background
   * @default true
   */
  showBackground?: boolean;
  /**
   * Background pattern variant
   * @default 'dots'
   */
  backgroundVariant?: BackgroundVariant;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Canvas - A workflow canvas component powered by React Flow
 *
 * @example
 * ```tsx
 * <Canvas
 *   initialNodes={[
 *     { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }
 *   ]}
 *   initialEdges={[]}
 *   onChange={(nodes, edges) => console.log(nodes, edges)}
 * />
 * ```
 */
export const Canvas: FC<CanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  onChange,
  height = '600px',
  showMiniMap = true,
  showControls = true,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
  className = '',
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onChange?.(nodes, newEdges);
    },
    [edges, nodes, onChange, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      setTimeout(() => {
        onChange?.(nodes, edges);
      }, 0);
    },
    [onNodesChange, onChange, nodes, edges]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setTimeout(() => {
        onChange?.(nodes, edges);
      }, 0);
    },
    [onEdgesChange, onChange, nodes, edges]
  );

  return (
    <div className={`w6w-canvas ${className}`} style={{ height, width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        panActivationKeyCode="Space"
        proOptions={{ hideAttribution: true }}
      >
        {showBackground && <Background variant={backgroundVariant} />}
        {showControls && <Controls />}
        {showMiniMap && <MiniMap />}
      </ReactFlow>
    </div>
  );
};
