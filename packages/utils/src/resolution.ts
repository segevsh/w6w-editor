// resolution.ts

export interface ResolutionContext {
    nodes: Record<string, {
        output: Record<string, any>;
        status: 'completed' | 'pending' | 'failed';
    }>;
    vars: Record<string, any>;
    config: Record<string, any>;
    input: Record<string, any>;
    credentials: Record<string, any>;
    system: {
        execution_id: string;
        workflow_id: string;
        timestamp: number;
        environment: 'development' | 'production';
    };
}

export function resolveValue(expr: string, context: ResolutionContext): any {
    // Not a variable reference
    if (!expr.startsWith('{{') || !expr.endsWith('}}')) {
        return expr;
    }

    // Parse: {{source.path | transform}}
    const inner = expr.slice(2, -2).trim();
    const parts = inner.split('|').map(s => s.trim());
    const path = parts[0];
    if (!path) {
        throw new Error('Empty variable reference');
    }
    const transform = parts[1];
    const [source, ...rest] = path.split('.');

    // Get base value
    let value: any;
    switch (source) {
        case 'nodes': {
            const [nodeId, ...nodePath] = rest;
            if (!nodeId) {
                throw new Error('Node ID is required for nodes reference');
            }
            value = getByPath(context.nodes[nodeId]?.output, nodePath);
            break;
        }
        case 'vars':
            value = getByPath(context.vars, rest);
            break;
        case 'config':
            value = getByPath(context.config, rest);
            break;
        case 'input':
            value = getByPath(context.input, rest);
            break;
        case 'credentials':
            value = getByPath(context.credentials, rest);
            break;
        case 'system':
            value = getByPath(context.system, rest);
            break;
        default:
            throw new Error(`Unknown source: ${source}`);
    }

    // Apply transform
    if (transform) {
        value = applyTransform(value, transform);
    }

    return value;
}

function getByPath(obj: any, path: string[]): any {
    return path.reduce((acc, key) => acc?.[key], obj);
}

function applyTransform(value: any, transform: string): any {
    switch (transform) {
        case 'first': return Array.isArray(value) ? value[0] : value;
        case 'last': return Array.isArray(value) ? value.at(-1) : value;
        case 'length': return Array.isArray(value) ? value.length : String(value).length;
        case 'uppercase': return String(value).toUpperCase();
        case 'lowercase': return String(value).toLowerCase();
        case 'json': return JSON.stringify(value);
        case 'keys': return Object.keys(value);
        case 'values': return Object.values(value);
        default: throw new Error(`Unknown transform: ${transform}`);
    }
}