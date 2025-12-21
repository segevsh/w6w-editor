import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkflowEditor } from '../WorkflowEditor';
import type { Workflow } from '../../types';

// Import workflow mocks from shared __mocks__ directory
// Type assertion needed because JSON imports have number[] instead of tuple types
import simpleHttpWebhookJson from '../../../../../__mocks__/simple_http_webhook.json';
import conditionalUserRoutingJson from '../../../../../__mocks__/conditional_user_routing.json';
import parallelNotificationsJson from '../../../../../__mocks__/parallel_notifications.json';
import orderWithErrorHandlingJson from '../../../../../__mocks__/order_with_error_handling.json';
import dataEtlPipelineJson from '../../../../../__mocks__/data_etl_pipeline.json';

// Cast JSON imports to Workflow type (schema format)
const simpleHttpWebhook = simpleHttpWebhookJson as unknown as Workflow;
const conditionalUserRouting = conditionalUserRoutingJson as unknown as Workflow;
const parallelNotifications = parallelNotificationsJson as unknown as Workflow;
const orderWithErrorHandling = orderWithErrorHandlingJson as unknown as Workflow;
const dataEtlPipeline = dataEtlPipelineJson as unknown as Workflow;

const meta = {
  title: 'Workflows/Mock Workflows',
  component: WorkflowEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'workflow-changed' },
  },
} satisfies Meta<typeof WorkflowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple HTTP Webhook
 *
 * A basic linear workflow: webhook trigger → HTTP request → log response
 *
 * Tests: Linear flow, basic node connections
 */
export const SimpleHttpWebhook: Story = {
  args: {
    // Pass schema workflow directly - editor handles conversion internally
    initialWorkflow: simpleHttpWebhook,
    height: '600px',
  },
  parameters: {
    docs: {
      description: {
        story: `**${simpleHttpWebhook.name}**\n\n${simpleHttpWebhook.description}\n\n- Nodes: ${simpleHttpWebhook.nodes.length}\n- Edges: ${simpleHttpWebhook.edges.length}\n- Tags: ${simpleHttpWebhook.tags?.join(', ')}`,
      },
    },
  },
};

/**
 * Conditional User Routing
 *
 * Routes users to different onboarding flows based on account type (premium/standard/trial)
 *
 * Tests: Conditional branching, multi-path merge
 */
export const ConditionalUserRouting: Story = {
  args: {
    initialWorkflow: conditionalUserRouting,
    height: '700px',
  },
  parameters: {
    docs: {
      description: {
        story: `**${conditionalUserRouting.name}**\n\n${conditionalUserRouting.description}\n\n- Nodes: ${conditionalUserRouting.nodes.length}\n- Edges: ${conditionalUserRouting.edges.length}\n- Tags: ${conditionalUserRouting.tags?.join(', ')}`,
      },
    },
  },
};

/**
 * Parallel Notifications
 *
 * Sends notifications across multiple channels (email, SMS, push, Slack) in parallel
 *
 * Tests: Parallel split/merge pattern, multiple integrations
 */
export const ParallelNotifications: Story = {
  args: {
    initialWorkflow: parallelNotifications,
    height: '700px',
  },
  parameters: {
    docs: {
      description: {
        story: `**${parallelNotifications.name}**\n\n${parallelNotifications.description}\n\n- Nodes: ${parallelNotifications.nodes.length}\n- Edges: ${parallelNotifications.edges.length}\n- Tags: ${parallelNotifications.tags?.join(', ')}`,
      },
    },
  },
};

/**
 * Order Processing with Error Handling
 *
 * Processes orders with validation, inventory check, payment, and shipping - includes retry logic and error paths
 *
 * Tests: Error handling, retry loops, workflow variables
 */
export const OrderWithErrorHandling: Story = {
  args: {
    initialWorkflow: orderWithErrorHandling,
    height: '800px',
  },
  parameters: {
    docs: {
      description: {
        story: `**${orderWithErrorHandling.name}**\n\n${orderWithErrorHandling.description}\n\n- Nodes: ${orderWithErrorHandling.nodes.length}\n- Edges: ${orderWithErrorHandling.edges.length}\n- Tags: ${orderWithErrorHandling.tags?.join(', ')}\n- Variables: ${Object.keys(orderWithErrorHandling.vars || {}).join(', ')}`,
      },
    },
  },
};

/**
 * Data ETL Pipeline
 *
 * Extracts customer data from PostgreSQL and MongoDB, transforms it, and loads into BigQuery
 *
 * Tests: Transform nodes, loop nodes, scheduled triggers, multiple data sources
 */
export const DataEtlPipeline: Story = {
  args: {
    initialWorkflow: dataEtlPipeline,
    height: '800px',
  },
  parameters: {
    docs: {
      description: {
        story: `**${dataEtlPipeline.name}**\n\n${dataEtlPipeline.description}\n\n- Nodes: ${dataEtlPipeline.nodes.length}\n- Edges: ${dataEtlPipeline.edges.length}\n- Tags: ${dataEtlPipeline.tags?.join(', ')}\n- Variables: ${Object.keys(dataEtlPipeline.vars || {}).join(', ')}`,
      },
    },
  },
};
