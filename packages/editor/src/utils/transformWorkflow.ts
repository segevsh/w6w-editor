/**
 * Transforms between W6W schema workflow format and React Flow format
 *
 * W6W schema uses:
 * - position: [x, y] array
 * - edge source/target can include port handles (e.g., "nodeId:portName")
 *
 * React Flow expects:
 * - position: { x, y } object
 * - separate sourceHandle/targetHandle fields
 *
 * The editor uses schema types at its public API boundary and converts
 * to/from React Flow format internally.
 */

import type {
  Workflow as SchemaWorkflow,
  Node as SchemaNode,
  Edge as SchemaEdge,
} from '../types/schema';

/**
 * Internal React Flow node format used within the editor
 */
export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

/**
 * Internal React Flow edge format used within the editor
 */
export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

/**
 * Internal React Flow workflow format used within the editor
 */
export interface ReactFlowWorkflow {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

// ============================================================================
// Schema -> React Flow (for initializing the editor)
// ============================================================================

/**
 * Parse edge endpoint that may include port handle
 * @example "nd_node_001:out1" -> { nodeId: "nd_node_001", handle: "out1" }
 * @example "nd_node_001" -> { nodeId: "nd_node_001", handle: undefined }
 */
function parseEdgeEndpoint(endpoint: string): { nodeId: string; handle?: string } {
  const colonIndex = endpoint.indexOf(':');
  if (colonIndex !== -1) {
    return {
      nodeId: endpoint.substring(0, colonIndex),
      handle: endpoint.substring(colonIndex + 1),
    };
  }
  return { nodeId: endpoint };
}

/**
 * Check if a node is in React Flow format (has nested data object)
 */
function isReactFlowNode(node: unknown): node is ReactFlowNode {
  if (typeof node !== 'object' || node === null) return false;
  const n = node as Record<string, unknown>;
  // React Flow format has: type === 'workflow' AND data is an object AND position is { x, y }
  return (
    n.type === 'workflow' &&
    typeof n.data === 'object' &&
    n.data !== null &&
    typeof n.position === 'object' &&
    n.position !== null &&
    !Array.isArray(n.position)
  );
}

/**
 * Transform a schema node to React Flow node format
 * Also handles React Flow format input (passes through with appName enrichment)
 */
export function schemaNodeToReactFlow(schemaNode: SchemaNode): ReactFlowNode {
  // Check if this is already in React Flow format (from database that stores RF format)
  if (isReactFlowNode(schemaNode)) {
    const rfNode = schemaNode as unknown as ReactFlowNode;
    const data = rfNode.data || {};

    // Enrich with appName if not present but app is
    const appName = data.appName || (data.app
      ? String(data.app).charAt(0).toUpperCase() + String(data.app).slice(1)
      : undefined);

    return {
      ...rfNode,
      data: {
        ...data,
        appName,
        appVersion: data.appVersion || data.version,
      },
    };
  }

  // Handle schema format: position array -> object
  const position = Array.isArray(schemaNode.position)
    ? { x: schemaNode.position[0] ?? 0, y: schemaNode.position[1] ?? 0 }
    : { x: 0, y: 0 };

  // Create display name from app identifier (capitalize first letter)
  const appName = schemaNode.app
    ? schemaNode.app.charAt(0).toUpperCase() + schemaNode.app.slice(1)
    : undefined;

  return {
    id: schemaNode.id,
    type: 'workflow', // All nodes use custom workflow type
    position,
    data: {
      // Schema fields
      label: schemaNode.label || schemaNode.action || schemaNode.id,
      type: schemaNode.type,
      nodeType: schemaNode.type, // Legacy alias
      package: schemaNode.package,
      app: schemaNode.app,
      version: schemaNode.version,
      action: schemaNode.action,
      config: schemaNode.config,
      disabled: schemaNode.disabled,
      notes: schemaNode.notes,
      input: schemaNode.input,
      output: schemaNode.output,
      authenticationId: schemaNode.authenticationId,
      metadata: schemaNode.metadata,
      // UI fields
      appName,
      appVersion: schemaNode.version,
    },
  };
}

/**
 * Transform a schema edge to React Flow edge format
 */
export function schemaEdgeToReactFlow(schemaEdge: SchemaEdge): ReactFlowEdge {
  const source = parseEdgeEndpoint(schemaEdge.source);
  const target = parseEdgeEndpoint(schemaEdge.target);

  return {
    id: schemaEdge.id,
    source: source.nodeId,
    target: target.nodeId,
    sourceHandle: source.handle,
    targetHandle: target.handle,
  };
}

/**
 * Transform a complete schema workflow to React Flow format
 */
export function schemaWorkflowToReactFlow(schemaWorkflow: SchemaWorkflow): ReactFlowWorkflow {
  return {
    nodes: schemaWorkflow.nodes.map(schemaNodeToReactFlow),
    edges: schemaWorkflow.edges.map(schemaEdgeToReactFlow),
  };
}

// ============================================================================
// React Flow -> Schema (for exporting from the editor)
// ============================================================================

/**
 * Transform a React Flow node to schema node format
 */
export function reactFlowNodeToSchema(rfNode: ReactFlowNode): SchemaNode {
  const data = rfNode.data || {};
  const position = rfNode.position || { x: 0, y: 0 };

  return {
    id: rfNode.id,
    type: (data.type || data.nodeType || 'action') as SchemaNode['type'],
    position: [position.x, position.y],
    label: data.label as string | undefined,
    package: data.package as string | undefined,
    app: data.app as string | undefined,
    version: data.version as string | undefined,
    action: data.action as string | undefined,
    config: data.config as Record<string, unknown> | undefined,
    disabled: data.disabled as boolean | undefined,
    notes: data.notes as string | undefined,
    input: data.input as string[] | undefined,
    output: data.output as string[] | undefined,
    authenticationId: data.authenticationId as string | undefined,
    metadata: data.metadata as Record<string, unknown> | undefined,
  } as SchemaNode;
}

/**
 * Transform a React Flow edge to schema edge format
 */
export function reactFlowEdgeToSchema(rfEdge: ReactFlowEdge): SchemaEdge {
  let source = rfEdge.source;
  let target = rfEdge.target;

  // Append handle if present (schema uses "nodeId:handle" format)
  if (rfEdge.sourceHandle) {
    source = `${source}:${rfEdge.sourceHandle}`;
  }
  if (rfEdge.targetHandle) {
    target = `${target}:${rfEdge.targetHandle}`;
  }

  return {
    id: rfEdge.id,
    source,
    target,
  } as SchemaEdge;
}

/**
 * Transform React Flow workflow to schema format
 * Returns just nodes and edges - caller adds workflow metadata (id, name, etc.)
 */
export function reactFlowWorkflowToSchema(rfWorkflow: ReactFlowWorkflow): {
  nodes: SchemaNode[];
  edges: SchemaEdge[];
} {
  return {
    nodes: rfWorkflow.nodes.map(reactFlowNodeToSchema),
    edges: rfWorkflow.edges.map(reactFlowEdgeToSchema),
  };
}

// ============================================================================
// Legacy exports for backward compatibility
// ============================================================================

// Re-export with old names for any existing code using these
export {
  schemaNodeToReactFlow as transformNode,
  schemaEdgeToReactFlow as transformEdge,
  schemaWorkflowToReactFlow as transformWorkflow,
};

// Legacy type aliases
export type W6WSchemaNode = SchemaNode;
export type W6WSchemaEdge = SchemaEdge;
export type W6WSchemaWorkflow = SchemaWorkflow;

/**
 * Type guard to check if an object looks like a schema workflow
 */
export function isSchemaWorkflow(obj: unknown): obj is SchemaWorkflow {
  if (typeof obj !== 'object' || obj === null) return false;
  const workflow = obj as Record<string, unknown>;
  return (
    typeof workflow.id === 'string' &&
    typeof workflow.name === 'string' &&
    Array.isArray(workflow.nodes) &&
    Array.isArray(workflow.edges)
  );
}

// Legacy alias
export const isW6WSchemaWorkflow = isSchemaWorkflow;
