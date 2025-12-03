import { z } from 'zod';
import { idSchema } from './id';
import { CONSTS } from './consts';

export const edgeSchema = z.object({
    id: idSchema(CONSTS.idPrefix.edge),

    /**
     * Source node ID
     * @description Source node ID
     * 
     * @example 
     *   - "nd123abc"
     *   - "nd456def:out1" -- with port handle (probably most common case)
     */
    source: z.string().min(1, { message: 'Source node ID is required' }),


    /**
     * Target node ID
     * @description Target node ID
     * 
     * @example 
     *   - "nd789ghi"
     *   - "nd101jkl:in2" -- with port handle (probably most common case)
     */
    target: z.string().min(1, { message: 'Target node ID is required' }),

    label: z.string().describe('Optional label displayed on the edge').optional(),

});

export type Edge = z.infer<typeof edgeSchema>;