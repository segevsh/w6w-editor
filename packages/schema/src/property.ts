import z from "zod";

const dropdownOptionSchema = z.object({
    label: z.string().describe("Display label for the option"),
    value: z.any().describe("Value associated with the option"),
    title: z.string().optional().describe("Optional title for the option"),
    subtitle: z.string().optional().describe("Optional subtitle for the option"),
    icon: z.string().optional().describe("Optional icon URL for the option"),
});

/**
 * Editor Options Schema
 * @description Configuration for how the property is displayed and edited in the UI
 */
export const editorOptionsSchema = z.object({
    /**
     * Options array
     * @description Predefined options for select/dropdown inputs
     * @example ["option1", "option2", "option3"]
     * @example [{ label: "Option 1", value: "opt1" }, { label: "Option 2", value: "opt2" }]
     */
    options: z.array(z.union([z.string(), z.object(dropdownOptionSchema)])).optional(),

    /**
     * Placeholder text
     * @description Placeholder text displayed in the input field
     * @example "Enter your API key"
     */
    placeholder: z.string().optional(),

    /**
     * Hint text
     * @description Helper text displayed below the input field
     * @example "You can find your API key in the settings page"
     */
    hint: z.string().optional(),

    /**
     * Input type
     * @description Type of input control to render
     * @example "text", "password", "email", "url", "textarea", "select", "number"
     */
    inputType: z
        .enum(["text", "password", "email", "url", "textarea", "select", "number", "checkbox", "radio"])
        .optional(),
});

export type EditorOptions = z.infer<typeof editorOptionsSchema>;

/**
 * Property Schema
 * @description Schema for defining properties with typed values
 */
export const propertySchema = z.object({
    /**
     * Property name
     * @description Unique identifier for the property
     * @example "userId", "maxRetries", "endpoints"
     */
    name: z
        .string()
        .min(1, { message: "Property name is required" })
        .max(100, { message: "Property name must be at most 100 characters" })
        .regex(/^\w+$/, {
            message: "Property name must contain only alphanumeric characters and underscores",
        }),

    /**
     * Display name
     * @description Human-readable name for the property
     * @example "User ID", "Max Retries", "API Endpoints"
     */
    displayName: z
        .string()
        .min(1, { message: "Display name is required" })
        .max(200, { message: "Display name must be at most 200 characters" }),

    /**
     * Property type
     * @description Data type of the property
     * @example "string", "number", "boolean", "object", "array"
     */
    type: z.enum(["string", "number", "boolean", "object", "array"]).describe("Data type of the property"),

    /**
     * Default value
     * @description Default value assigned to the property
     * @example
     *  - "default" (for string type)
     *  - 0 (for number type)
     *  - false (for boolean type)
     *  - {} (for object type)
     *  - [] (for array type)
     */
    defaultValue: z.any().optional().describe("Default value assigned to the property"),

    /**
     * Property description
     * @description User-friendly description of the property
     * @example "The unique identifier for the user in the system"
     */
    description: z.string().max(500, { message: "Description must be at most 500 characters" }).optional(),

    /**
     * Required flag
     * @description Indicates whether the property is required
     * @example true, false
     */
    required: z.boolean().default(false).describe("Indicates whether the property is required"),

    /**
     * Editor options
     * @description Configuration for how the property is displayed and edited in the UI
     */
    editorOptions: editorOptionsSchema.optional(),

    /**
     * Metadata
     * @description Additional metadata for the property
     * @example { "min": 0, "max": 100, "pattern": "^[A-Z]" }
     */
    metadata: z.record(z.string(), z.any()).describe("Additional metadata for the property").optional(),
});

export type Property = z.infer<typeof propertySchema> & {
    /**
     * 
     * @param value current value of the property
     * @param context additional information such as data from previous or other properties. 
     * @returns 
     */
    validate?: (value: any, context?: any) => string | null;
};
