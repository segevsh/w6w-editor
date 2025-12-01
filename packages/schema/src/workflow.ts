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

/**
{
   
    "triggers": {
      "type": "array",
      "description": "Events or conditions that can start this workflow",
      "items": {
        "type": "string",
        "description": "Trigger ID reference",
        "pattern": "^trigger_[a-zA-Z0-9]+$"
      }
    },
    "variables": {
      "type": "object",
      "description": "Workflow-level variables accessible across all nodes",
      "additionalProperties": {
        "$ref": "#/definitions/variable"
      }
    },
    "settings": {
      "type": "object",
      "description": "User-configurable workflow settings",
      "properties": {
        "timeout": {
          "type": "integer",
          "description": "Maximum execution time in seconds",
          "minimum": 1,
          "maximum": 3600,
          "default": 300
        },
        "retryOnError": {
          "type": "boolean",
          "description": "Whether to retry the workflow on failure",
          "default": false
        },
        "maxRetries": {
          "type": "integer",
          "description": "Maximum number of retry attempts",
          "minimum": 0,
          "maximum": 10,
          "default": 3
        },
        "notifications": {
          "type": "object",
          "description": "Notification preferences for workflow events",
          "properties": {
            "onSuccess": {
              "type": "boolean",
              "description": "Send notification when workflow completes successfully",
              "default": false
            },
            "onFailure": {
              "type": "boolean",
              "description": "Send notification when workflow fails",
              "default": true
            },
            "channels": {
              "type": "array",
              "description": "Notification channels (email, slack, etc.)",
              "items": {
                "type": "string",
                "enum": [
                  "email",
                  "slack",
                  "webhook"
                ]
              }
            }
          }
        },
        "schedule": {
          "type": "object",
          "description": "Scheduled execution settings",
          "properties": {
            "enabled": {
              "type": "boolean",
              "default": false
            },
            "cron": {
              "type": "string",
              "description": "Cron expression for scheduling",
              "examples": [
                "0 9 * * MON-FRI",
              ]
            },
            "timezone": {
              "type": "string",
              "description": "Timezone for schedule",
              "examples": [
                "America/New_York",
                "UTC"
              ]
            }
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "description": "System metadata tracked automatically",
      "properties": {
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "When the workflow was created"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time",
          "description": "Last modification timestamp"
        },
        "createdBy": {
          "type": "string",
          "description": "User ID who created the workflow"
        },
        "lastEditedBy": {
          "type": "string",
          "description": "User ID who last modified the workflow"
        },
        "executionCount": {
          "type": "integer",
          "description": "Total number of times executed",
          "minimum": 0
        },
        "lastExecutedAt": {
          "type": "string",
          "format": "date-time",
          "description": "Timestamp of last execution"
        },
        "averageExecutionTime": {
          "type": "number",
          "description": "Average execution time in seconds"
        }
      }
    },
    "permissions": {
      "type": "object",
      "description": "Access control for the workflow",
      "properties": {
        "owner": {
          "type": "string",
          "description": "User ID of the workflow owner"
        },
        "visibility": {
          "type": "string",
          "enum": [
            "private",
            "team",
            "organization",
            "public"
          ],
          "default": "private"
        },
        "collaborators": {
          "type": "array",
          "description": "Users with edit access",
          "items": {
            "type": "object",
            "properties": {
              "userId": {
                "type": "string"
              },
              "role": {
                "type": "string",
                "enum": [
                  "viewer",
                  "editor",
                  "admin"
                ]
              }
            }
          }
        }
      }
    }
  }
 */