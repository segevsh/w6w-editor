import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { WorkflowNode, type WorkflowNodeData } from '../WorkflowNode';
import '@xyflow/react/dist/style.css';

// Simple icon components for stories
const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="#E01E5A" width="100%" height="100%">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="#EA4335" width="100%" height="100%">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="#333" width="100%" height="100%">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" fill="#635BFF" width="100%" height="100%">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
  </svg>
);

const WebhookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" width="100%" height="100%">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const nodeTypes = {
  workflow: WorkflowNode,
};

// Wrapper component to render WorkflowNode inside ReactFlow
const WorkflowNodeWrapper = ({
  data,
  selected = false,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) => {
  const nodes = [
    {
      id: '1',
      type: 'workflow',
      position: { x: 100, y: 100 },
      data,
      selected,
    },
  ];

  return (
    <div style={{ width: '400px', height: '300px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={[]}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        />
      </ReactFlowProvider>
    </div>
  );
};

const meta = {
  title: 'Nodes/WorkflowNode',
  component: WorkflowNodeWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WorkflowNodeWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Slack - Send Message
 *
 * Primary example showing the node structure:
 * - First row: App label with icon (Slack)
 * - Second row: Action label (Send Message)
 */
export const SlackSendMessage: Story = {
  args: {
    data: {
      label: 'Send Message',
      nodeType: 'action',
      appName: 'Slack',
      appIcon: <SlackIcon />,
    },
  },
};

/**
 * Gmail - Send Email
 *
 * Email action with Gmail app label
 */
export const GmailSendEmail: Story = {
  args: {
    data: {
      label: 'Send Email',
      nodeType: 'action',
      appName: 'Gmail',
      appIcon: <GmailIcon />,
    },
  },
};

/**
 * GitHub - Create Issue
 *
 * GitHub integration action
 */
export const GitHubCreateIssue: Story = {
  args: {
    data: {
      label: 'Create Issue',
      nodeType: 'action',
      appName: 'GitHub',
      appIcon: <GitHubIcon />,
    },
  },
};

/**
 * Stripe - Create Payment
 *
 * Payment processing action
 */
export const StripeCreatePayment: Story = {
  args: {
    data: {
      label: 'Create Payment',
      nodeType: 'action',
      appName: 'Stripe',
      appIcon: <StripeIcon />,
    },
  },
};

/**
 * Webhook - Incoming Request (Trigger)
 *
 * Trigger node example with app label
 */
export const WebhookTrigger: Story = {
  args: {
    data: {
      label: 'Incoming Request',
      nodeType: 'trigger',
      appName: 'Webhook',
      appIcon: <WebhookIcon />,
    },
  },
};

/**
 * Gmail - New Email (Trigger)
 *
 * Email trigger with Gmail app label
 */
export const GmailNewEmail: Story = {
  args: {
    data: {
      label: 'New Email',
      nodeType: 'trigger',
      appName: 'Gmail',
      appIcon: <GmailIcon />,
    },
  },
};

/**
 * Basic node without app label
 *
 * Backward compatible - nodes without app info still work
 */
export const BasicNodeWithoutAppLabel: Story = {
  args: {
    data: {
      label: 'My Node',
      nodeType: 'action',
    },
  },
};

/**
 * Selected state
 *
 * Node with selection highlight and stronger shadow
 */
export const SelectedNode: Story = {
  args: {
    data: {
      label: 'Send Message',
      nodeType: 'action',
      appName: 'Slack',
      appIcon: <SlackIcon />,
    },
    selected: true,
  },
};

/**
 * Disabled state
 *
 * Node with reduced opacity when disabled
 */
export const DisabledNode: Story = {
  args: {
    data: {
      label: 'Send Message',
      nodeType: 'action',
      appName: 'Slack',
      appIcon: <SlackIcon />,
      disabled: true,
    },
  },
};

/**
 * Multiple handles
 *
 * Condition node with multiple input/output handles
 */
export const MultipleHandles: Story = {
  args: {
    data: {
      label: 'Route by Status',
      nodeType: 'condition',
      appName: 'Logic',
      input: ['in1', 'in2'],
      output: ['success', 'failure', 'timeout'],
    },
  },
};

/**
 * All node types gallery
 *
 * Shows all node types with app labels
 */
export const AllNodeTypes: Story = {
  args: {
    data: {
      label: 'Node',
      nodeType: 'action',
    },
  },
  render: () => {
    const nodeConfigs: { title: string; data: WorkflowNodeData }[] = [
      {
        title: 'Trigger',
        data: { label: 'New Email', nodeType: 'trigger', appName: 'Gmail', appIcon: <GmailIcon /> },
      },
      {
        title: 'Action',
        data: { label: 'Send Message', nodeType: 'action', appName: 'Slack', appIcon: <SlackIcon /> },
      },
      {
        title: 'Condition',
        data: { label: 'Check Status', nodeType: 'condition', appName: 'Logic' },
      },
      {
        title: 'Transform',
        data: { label: 'Format Data', nodeType: 'transform', appName: 'Transform' },
      },
      {
        title: 'Loop',
        data: { label: 'For Each Item', nodeType: 'loop', appName: 'Loop' },
      },
    ];

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {nodeConfigs.map((config) => (
          <div key={config.title}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
              {config.title}
            </p>
            <WorkflowNodeWrapper data={config.data} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Common integrations gallery
 *
 * Shows popular app integrations with their actions
 */
export const CommonIntegrations: Story = {
  args: {
    data: {
      label: 'Node',
      nodeType: 'action',
    },
  },
  render: () => {
    const integrations: { data: WorkflowNodeData }[] = [
      { data: { label: 'Send Message', nodeType: 'action', appName: 'Slack', appIcon: <SlackIcon /> } },
      { data: { label: 'Send Email', nodeType: 'action', appName: 'Gmail', appIcon: <GmailIcon /> } },
      { data: { label: 'Create Issue', nodeType: 'action', appName: 'GitHub', appIcon: <GitHubIcon /> } },
      { data: { label: 'Create Payment', nodeType: 'action', appName: 'Stripe', appIcon: <StripeIcon /> } },
    ];

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {integrations.map((config, index) => (
          <WorkflowNodeWrapper key={index} data={config.data} />
        ))}
      </div>
    );
  },
};
