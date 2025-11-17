import { z } from 'zod';
import { idSchema } from './id';
import { CONSTS } from './consts';

/**
 * Connection Schema
 *
 * Represents an active connection instance used in workflows.
 * Note: Sensitive credentials (client_id, client_secret) are stored separately
 * in a secure credentials manager, not in the connection instance.
 */
export const connectionSchema = z.discriminatedUnion('type', [
    /**
     * OAuth 2.0 Connection
     * Contains the active access token and metadata for an authorized OAuth connection.
     * The client_id/client_secret used to obtain this token are stored separately.
     */
    z.object({
        type: z.literal('oauth'),

        id: idSchema(CONSTS.idPrefix.connection),

        name: z.string().min(1).describe('Human-readable name for this connection'),

        provider: z.string().describe('OAuth provider identifier (e.g., "google", "github", "slack")'),

        accessToken: z.string().describe('Active OAuth access token'),

        refreshToken: z.string().optional().describe('Refresh token for obtaining new access tokens'),

        expiresAt: z.number().int().positive().optional().describe('Unix timestamp (seconds) when the access token expires'),

        scopes: z.array(z.string()).optional().describe('Granted OAuth scopes'),

        metadata: z.record(z.string(), z.any()).optional().describe('Additional provider-specific metadata'),
    }),

    /**
     * Bearer Token Authentication (API Key)
     * Most commonly used for services that require a simple API key for access
     */
    z.object({
        type: z.literal('bearer'),

        id: idSchema(CONSTS.idPrefix.connection),

        name: z.string().min(1).describe('Human-readable name for this connection'),

        token: z.string().describe('Bearer token or API key'),

        metadata: z.record(z.string(), z.any()).optional().describe('Additional metadata'),
    }),

    /**
     * Custom Header Authentication
     * Allows users to define custom headers, body, and query parameters for authentication
     */
    z.object({
        type: z.literal('custom_header'),

        id: idSchema(CONSTS.idPrefix.connection),

        name: z.string().min(1).describe('Human-readable name for this connection'),

        headers: z.record(z.string(), z.string()).optional().describe('Custom authentication headers'),

        body: z.record(z.string(), z.string()).optional().describe('Custom body parameters'),

        query: z.record(z.string(), z.string()).optional().describe('Custom query parameters'),

        metadata: z.record(z.string(), z.any()).optional().describe('Additional metadata'),
    }),
]);

export type Connection = z.infer<typeof connectionSchema>;