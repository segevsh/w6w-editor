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

const WebhookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" width="100%" height="100%">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const HttpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="100%" height="100%">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
 * Basic node without app label - backward compatible
 */
export const BasicNode: Story = {
  args: {
    data: {
      label: 'My Node',
      nodeType: 'action',
    },
  },
};

/**
 * Node with app label showing icon and app name
 */
export const WithAppLabel: Story = {
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
 * Trigger node with app label
 */
export const TriggerWithAppLabel: Story = {
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
 * Webhook trigger node
 */
export const WebhookTrigger: Story = {
  args: {
    data: {
      label: 'Incoming Webhook',
      nodeType: 'trigger',
      appName: 'Webhook',
      appIcon: <WebhookIcon />,
    },
  },
};

/**
 * HTTP request action node
 */
export const HttpAction: Story = {
  args: {
    data: {
      label: 'GET /api/users',
      nodeType: 'action',
      appName: 'HTTP',
      appIcon: <HttpIcon />,
    },
  },
};

/**
 * Condition node with app label
 */
export const ConditionNode: Story = {
  args: {
    data: {
      label: 'Check Status',
      nodeType: 'condition',
      appName: 'Logic',
    },
  },
};

/**
 * Transform node with app label
 */
export const TransformNode: Story = {
  args: {
    data: {
      label: 'Format Data',
      nodeType: 'transform',
      appName: 'Transform',
    },
  },
};

/**
 * Loop node with app label
 */
export const LoopNode: Story = {
  args: {
    data: {
      label: 'For Each Item',
      nodeType: 'loop',
      appName: 'Loop',
    },
  },
};

/**
 * Selected node state
 */
export const SelectedNode: Story = {
  args: {
    data: {
      label: 'Send Notification',
      nodeType: 'action',
      appName: 'Slack',
      appIcon: <SlackIcon />,
    },
    selected: true,
  },
};

/**
 * Disabled node state
 */
export const DisabledNode: Story = {
  args: {
    data: {
      label: 'Disabled Step',
      nodeType: 'action',
      appName: 'Slack',
      appIcon: <SlackIcon />,
      disabled: true,
    },
  },
};

/**
 * Node with multiple input/output handles
 */
export const MultipleHandles: Story = {
  args: {
    data: {
      label: 'Router',
      nodeType: 'condition',
      appName: 'Logic',
      input: ['in1', 'in2'],
      output: ['success', 'failure', 'timeout'],
    },
  },
};

/**
 * Comparison of nodes with and without app labels
 */
export const ComparisonWithWithoutAppLabel: Story = {
  args: {
    data: {
      label: 'Send Message',
      nodeType: 'action',
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
          Without App Label
        </p>
        <WorkflowNodeWrapper
          data={{
            label: 'Send Message',
            nodeType: 'action',
          }}
        />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
          With App Label
        </p>
        <WorkflowNodeWrapper
          data={{
            label: 'Send Message',
            nodeType: 'action',
            appName: 'Slack',
            appIcon: <SlackIcon />,
          }}
        />
      </div>
    </div>
  ),
};

/**
 * All node types with app labels
 */
export const AllNodeTypes: Story = {
  args: {
    data: {
      label: 'Node',
      nodeType: 'action',
    },
  },
  render: () => {
    const nodeConfigs: { data: WorkflowNodeData; label: string }[] = [
      {
        label: 'Trigger',
        data: { label: 'New Email', nodeType: 'trigger', appName: 'Gmail', appIcon: <GmailIcon /> },
      },
      {
        label: 'Action',
        data: { label: 'Send Message', nodeType: 'action', appName: 'Slack', appIcon: <SlackIcon /> },
      },
      {
        label: 'Condition',
        data: { label: 'Check Status', nodeType: 'condition', appName: 'Logic' },
      },
      {
        label: 'Transform',
        data: { label: 'Format Data', nodeType: 'transform', appName: 'Transform' },
      },
      {
        label: 'Loop',
        data: { label: 'For Each', nodeType: 'loop', appName: 'Loop' },
      },
    ];

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {nodeConfigs.map((config) => (
          <div key={config.label}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
              {config.label}
            </p>
            <WorkflowNodeWrapper data={config.data} />
          </div>
        ))}
      </div>
    );
  },
};
