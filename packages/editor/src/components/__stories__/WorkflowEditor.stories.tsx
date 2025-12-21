import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkflowEditor } from '../WorkflowEditor';
import type { Workflow } from '../../types';

const meta = {
  title: 'Components/WorkflowEditor',
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

// Helper to create a minimal valid workflow
const createWorkflow = (nodes: Workflow['nodes'], edges: Workflow['edges']): Workflow => ({
  id: 'story-workflow',
  name: 'Story Workflow',
  version: '1.0.0',
  status: 'draft',
  nodes,
  edges,
});

export const Empty: Story = {
  args: {
    initialWorkflow: createWorkflow([], []),
  },
};

export const WithNodes: Story = {
  args: {
    initialWorkflow: createWorkflow(
      [
        {
          id: '1',
          type: 'trigger',
          position: [100, 100],
          label: 'Start Node',
        },
        {
          id: '2',
          type: 'action',
          position: [300, 200],
          label: 'Process Node',
        },
        {
          id: '3',
          type: 'action',
          position: [500, 100],
          label: 'End Node',
        },
      ],
      [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
        },
      ]
    ),
  },
};

export const ComplexWorkflow: Story = {
  args: {
    initialWorkflow: createWorkflow(
      [
        {
          id: '1',
          type: 'trigger',
          position: [100, 100],
          label: 'Start',
        },
        {
          id: '2',
          type: 'action',
          position: [250, 50],
          label: 'Task A',
        },
        {
          id: '3',
          type: 'action',
          position: [250, 150],
          label: 'Task B',
        },
        {
          id: '4',
          type: 'transform',
          position: [400, 100],
          label: 'Join',
        },
        {
          id: '5',
          type: 'action',
          position: [550, 100],
          label: 'Complete',
        },
      ],
      [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e2-4', source: '2', target: '4' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ]
    ),
  },
};
