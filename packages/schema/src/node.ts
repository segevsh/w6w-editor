import { z } from 'zod';
import { idSchema } from './id';
import { positionSchema } from './position';
import { CONSTS } from './consts';

export const nodeTypeEnum = z.enum([
    'trigger',
    'action',
    'transform',
    'condition',
    'loop',
]);

export const nodeSchema = z.object({
    id: idSchema(CONSTS.idPrefix.node),

    type: nodeTypeEnum.describe('Type of the node, e.g., trigger, action, transform'),

    authenticationId: z.string().describe('ID for the connection used to authentciate this request').optional(),

    label: z.string().describe('Display label shown in the editor').optional(),

    position: positionSchema.describe('Visual position on the canvas'),
    
    config: z.record(z.string(), z.any()).describe('Node-specific configuration set by the user').optional(),

    notes: z.string().max(1000, {
        message: 'Notes cannot exceed 1000 characters'
    }).optional(),

    disabled: z.boolean().default(false).describe('Whether this node is disabled in execution'),

    input: z.array(z.string()).describe('Input ports/handles for receiving data').optional(),

    output: z.array(z.string()).describe('Output ports/handles for sending data').optional()
});