import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLabel } from '../AppLabel';

const meta = {
  title: 'UI/AppLabel',
  component: AppLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon as URL string or React node',
    },
    name: {
      control: 'text',
      description: 'Name of the app/package',
    },
    version: {
      control: 'text',
      description: 'Version string',
    },
    showVersion: {
      control: 'boolean',
      description: 'Whether to display the version',
    },
    fontSize: {
      control: { type: 'number', min: 8, max: 24 },
      description: 'Font size in pixels',
    },
  },
} satisfies Meta<typeof AppLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for stories
const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const WebhookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="100%" height="100%">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

/**
 * Default AppLabel with just a name
 */
export const Default: Story = {
  args: {
    name: 'Slack',
  },
};

/**
 * AppLabel with an SVG icon component
 */
export const WithIcon: Story = {
  args: {
    icon: <SlackIcon />,
    name: 'Slack',
  },
};

/**
 * AppLabel with version displayed
 */
export const WithVersion: Story = {
  args: {
    icon: <GmailIcon />,
    name: 'Gmail',
    version: '2.1.0',
    showVersion: true,
  },
};

/**
 * AppLabel with version hidden (default behavior)
 */
export const VersionHidden: Story = {
  args: {
    icon: <GmailIcon />,
    name: 'Gmail',
    version: '2.1.0',
    showVersion: false,
  },
};

/**
 * AppLabel with image URL as icon
 */
export const WithImageUrl: Story = {
  args: {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg',
    name: 'GitHub',
    version: '1.0.0',
    showVersion: true,
  },
};

/**
 * Small AppLabel (9px - used in WorkflowNode)
 */
export const SmallSize: Story = {
  args: {
    icon: <WebhookIcon />,
    name: 'Webhook',
    fontSize: 9,
  },
};

/**
 * Large AppLabel (16px)
 */
export const LargeSize: Story = {
  args: {
    icon: <SlackIcon />,
    name: 'Slack',
    version: '3.0.0',
    showVersion: true,
    fontSize: 16,
  },
};

/**
 * Multiple AppLabels showing different apps
 */
export const MultipleApps: Story = {
  args: {
    name: 'Slack',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <AppLabel icon={<SlackIcon />} name="Slack" version="2.0.0" showVersion />
      <AppLabel icon={<GmailIcon />} name="Gmail" version="1.5.0" showVersion />
      <AppLabel icon={<WebhookIcon />} name="Webhook" />
      <AppLabel name="Custom App" version="0.1.0" showVersion />
    </div>
  ),
};

/**
 * AppLabel in context - showing how it appears at different sizes
 */
export const SizeComparison: Story = {
  args: {
    name: 'Slack',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>9px (WorkflowNode size)</p>
        <AppLabel icon={<SlackIcon />} name="Slack" fontSize={9} />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>12px (Default)</p>
        <AppLabel icon={<SlackIcon />} name="Slack" fontSize={12} />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>16px (Large)</p>
        <AppLabel icon={<SlackIcon />} name="Slack" fontSize={16} />
      </div>
    </div>
  ),
};
