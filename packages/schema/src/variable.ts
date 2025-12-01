import z from "zod";

export const variableSchema = z.object({
    /**
     * Variable name
     * @description Name of the variable
     * 
     * @example 
     *  - "userId"
     *  - "sessionToken"
     */
    name: z.string().min(1, { message: 'Variable name is required' }).max(100, { message: 'Variable name must be at most 100 characters' }),


    /**
     * Indicates if the variable is secret
     * @description Indicates if the variable contains sensitive information
     * 
     * @example
     * - true
     * - false
     */
    isSecret: z.boolean().default(false).describe('Indicates if the variable contains sensitive information'),




    /**
     *  Variable type
     * @description Data type of the variable
     *  @example
     *   - "string"
     *   - "number"
     *   - "boolean"
     *   - "object"
     *   - "array"
     */
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']).describe('Data type of the variable'),

    /**
     * Variable default value
     * @description Default value assigned to the variable
     * 
     * @example
     *  - "defaultUser" (for string type)
     *  - 0 (for number type)
     *  - false (for boolean type)
     *  - {} (for object type)
     *  - [] (for array type)
     */
    defaultValue: z.any().optional().describe('Default value assigned to the variable'),

    /**
     * Variable description
     * @description User-friendly description of the variable
     * 
     * @example
     *  - "Stores the ID of the current user"
     *  - "Holds the session token for authentication"
     */
    description: z.string().max(500, { message: 'Description must be at most 500 characters' }).optional(),


    metadata: z.record(z.string(), z.any()).describe('Additional metadata for the variable').optional(),
});


export type Variable = z.infer<typeof variableSchema>;