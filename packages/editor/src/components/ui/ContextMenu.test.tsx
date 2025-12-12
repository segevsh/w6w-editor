import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  describe('Basic Functionality', () => {
    it('should render menu items correctly', () => {
      const items = [
        { label: 'Action 1', onClick: vi.fn() },
        { label: 'Action 2', onClick: vi.fn() },
      ];
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('should call onClick when menu item is clicked', () => {
      const onClick = vi.fn();
      const onClose = vi.fn();
      const items = [
        { label: 'Test Action', onClick },
      ];

      render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      fireEvent.click(screen.getByText('Test Action'));

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('should close when clicking outside', () => {
      const onClose = vi.fn();
      const items = [
        { label: 'Test Action', onClick: vi.fn() },
      ];

      render(
        <div>
          <ContextMenu
            x={100}
            y={200}
            items={items}
            onClose={onClose}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );

      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('should close when pressing Escape key', () => {
      const onClose = vi.fn();
      const items = [
        { label: 'Test Action', onClick: vi.fn() },
      ];

      render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('should not close when clicking inside menu', () => {
      const onClose = vi.fn();
      const items = [
        { label: 'Test Action', onClick: vi.fn() },
      ];

      const { container } = render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      const menu = container.querySelector('.context-menu');
      if (menu) {
        fireEvent.mouseDown(menu);
      }

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Task 1.3: Dark Mode Styles', () => {
    it('should apply destructive class to destructive items', () => {
      const items = [
        { label: 'Normal Action', onClick: vi.fn() },
        { label: 'Delete', onClick: vi.fn(), destructive: true },
      ];
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      const deleteButton = screen.getByText('Delete').closest('button');
      expect(deleteButton).toHaveClass('context-menu-item');
      expect(deleteButton).toHaveClass('destructive');

      const normalButton = screen.getByText('Normal Action').closest('button');
      expect(normalButton).toHaveClass('context-menu-item');
      expect(normalButton).not.toHaveClass('destructive');
    });

    it('should render with correct positioning', () => {
      const items = [
        { label: 'Test Action', onClick: vi.fn() },
      ];
      const onClose = vi.fn();

      const { container } = render(
        <ContextMenu
          x={150}
          y={250}
          items={items}
          onClose={onClose}
        />
      );

      const menu = container.querySelector('.context-menu');
      expect(menu).toHaveStyle({
        position: 'fixed',
        top: '250px',
        left: '150px',
      });
    });

    it('should render icons when provided', () => {
      const items = [
        { label: 'Action with Icon', onClick: vi.fn(), icon: '✏️' },
        { label: 'Action without Icon', onClick: vi.fn() },
      ];
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      // Icon should be rendered
      expect(screen.getByText('✏️')).toBeInTheDocument();
      expect(screen.getByText('Action with Icon')).toBeInTheDocument();
      expect(screen.getByText('Action without Icon')).toBeInTheDocument();
    });
  });

  describe('Styling Classes', () => {
    it('should apply correct CSS classes', () => {
      const items = [
        { label: 'Test Action', onClick: vi.fn() },
      ];
      const onClose = vi.fn();

      const { container } = render(
        <ContextMenu
          x={100}
          y={200}
          items={items}
          onClose={onClose}
        />
      );

      expect(container.querySelector('.context-menu')).toBeInTheDocument();
      expect(container.querySelector('.context-menu-list')).toBeInTheDocument();
      expect(container.querySelector('.context-menu-item')).toBeInTheDocument();
      expect(container.querySelector('.context-menu-label')).toBeInTheDocument();
    });
  });
});
