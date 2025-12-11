/**
 * Transforms a W6W schema workflow into React Flow format
 *
 * W6W schema uses:
 * - position: [x, y] array
 * - label at node root
 * - edge source/target can include port handles (e.g., "nodeId:portName")
 *
 * React Flow expects:
 * - position: { x, y } object
 * - data.label for node labels
 * - separate sourceHandle/targetHandle fields
 */

import type { Workflow, Node, Edge } from '../types';

/**
 * W6W Schema node format (from @w6w-io/schema)
 */
export interface W6WSchemaNode {
  id: string;
  type: string;
  position: [number, number] | [number, number, number] | { x: number; y: number };
  label?: string;
  package?: string;
  app?: string;
  version?: string;
  action?: string;
  config?: Record<string, unknown>;
  disabled?: boolean;
  notes?: string;
  input?: string[];
  output?: string[];
  authenticationId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * W6W Schema edge format (from @w6w-io/schema)
 */
export interface W6WSchemaEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/**
 * W6W Schema workflow format (from @w6w-io/schema)
 */
export interface W6WSchemaWorkflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  status?: string;
  tags?: string[];
  nodes: W6WSchemaNode[];
  edges: W6WSchemaEdge[];
  vars?: Record<string, unknown>;
}

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
 * Get React Flow node type based on W6W schema node type
 * All nodes use the custom 'workflow' type which supports dynamic handles
 */
function getReactFlowNodeType(_schemaType: string): string {
  // Use custom workflow node type for all nodes
  // This supports dynamic input/output handles
  return 'workflow';
}

/**
 * Transform a W6W schema node to React Flow node format
 */
export function transformNode(schemaNode: W6WSchemaNode): Node {
  // Handle position - can be array [x, y] or object { x, y }
  let position: { x: number; y: number };
  if (Array.isArray(schemaNode.position)) {
    position = { x: schemaNode.position[0], y: schemaNode.position[1] };
  } else {
    position = schemaNode.position;
  }

  return {
    id: schemaNode.id,
    type: getReactFlowNodeType(schemaNode.type),
    position,
    data: {
      label: schemaNode.label || schemaNode.action || schemaNode.id,
      nodeType: schemaNode.type,
      package: schemaNode.package,
      app: schemaNode.app,
      action: schemaNode.action,
      config: schemaNode.config,
      disabled: schemaNode.disabled,
      notes: schemaNode.notes,
      input: schemaNode.input,
      output: schemaNode.output,
    },
  };
}

/**
 * Transform a W6W schema edge to React Flow edge format
 */
export function transformEdge(schemaEdge: W6WSchemaEdge): Edge {
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
 * Transform a complete W6W schema workflow to React Flow format
 */
export function transformWorkflow(schemaWorkflow: W6WSchemaWorkflow): Workflow {
  return {
    nodes: schemaWorkflow.nodes.map(transformNode),
    edges: schemaWorkflow.edges.map(transformEdge),
  };
}

/**
 * Type guard to check if an object is a W6W schema workflow
 */
export function isW6WSchemaWorkflow(obj: unknown): obj is W6WSchemaWorkflow {
  if (typeof obj !== 'object' || obj === null) return false;
  const workflow = obj as Record<string, unknown>;
  return (
    typeof workflow.id === 'string' &&
    typeof workflow.name === 'string' &&
    Array.isArray(workflow.nodes) &&
    Array.isArray(workflow.edges)
  );
}
