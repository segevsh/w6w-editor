import { z } from 'zod';
import { idSchema } from './id';
import { CONSTS } from './consts';
import { nodeSchema } from './node';
import { edgeSchema } from './edge';
import { variableSchema } from './variable';

export const workflowSchema = z.object({
  id: idSchema(CONSTS.idPrefix.workflow),

  name: z.string().min(1).max(100).describe('Display name of the workflow shown to the user'),

  description: z.string().max(500).describe('User-friendly description of what this workflow does').optional(),

  version: z.string().regex(/^\d+\.\d+\.\d+$/, {
    message: 'Version must follow semantic versioning (e.g., 1.0.0)'
  }).describe('Semantic version of the workflow'),

  icon: z.string().describe('Icon identifier or emoji for visual representation').optional(),

  tags: z.array(z.string().min(1).max(50)).describe('Tags for categorizing and searching workflows').optional(),

  status: z.enum(['draft', 'active', 'paused', 'archived']).default('draft').describe('Current lifecycle status of the workflow'),

  nodes: z.array(z.lazy(() => nodeSchema)).describe('Collection of action nodes (steps) in the workflow'),

  edges: z.array(z.lazy(() => edgeSchema)).describe('Connections between nodes defining the flow'),

  vars: z.record(z.string(), variableSchema).describe('Workflow-level variables accessible across all nodes').optional(),


});


export type Workflow = z.infer<typeof workflowSchema>;