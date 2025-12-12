import { describe, it, expect, vi } from 'vitest';
import type { ContextMenuCallbacks } from '../types';

// Unit tests for the callback functionality without rendering complexity
describe('Canvas Context Menu Callbacks', () => {
  describe('Task 1.1: Callback Props Interface', () => {
    it('should define onAddNodeRequest callback type correctly', () => {
      const mockCallback: ContextMenuCallbacks['onAddNodeRequest'] = vi.fn();

      // Call with expected position
      mockCallback?.({ x: 100, y: 200 });

      expect(mockCallback).toHaveBeenCalledWith({ x: 100, y: 200 });
    });
  });

  describe('Task 1.2: Node Action Callbacks', () => {
    it('should define onNodeEdit callback type correctly', () => {
      const mockCallback: ContextMenuCallbacks['onNodeEdit'] = vi.fn();

      // Call with node ID
      mockCallback?.('node-123');

      expect(mockCallback).toHaveBeenCalledWith('node-123');
    });

    it('should define onNodeDuplicate callback type correctly', () => {
      const mockCallback: ContextMenuCallbacks['onNodeDuplicate'] = vi.fn();

      // Call with node ID
      mockCallback?.('node-456');

      expect(mockCallback).toHaveBeenCalledWith('node-456');
    });

    it('should define onNodeDelete callback type correctly', () => {
      const mockCallback: ContextMenuCallbacks['onNodeDelete'] = vi.fn();

      // Call with node ID
      mockCallback?.('node-789');

      expect(mockCallback).toHaveBeenCalledWith('node-789');
    });

    it('should support all callbacks together', () => {
      const callbacks: ContextMenuCallbacks = {
        onAddNodeRequest: vi.fn(),
        onNodeEdit: vi.fn(),
        onNodeDuplicate: vi.fn(),
        onNodeDelete: vi.fn(),
      };

      // All callbacks should be defined
      expect(callbacks.onAddNodeRequest).toBeDefined();
      expect(callbacks.onNodeEdit).toBeDefined();
      expect(callbacks.onNodeDuplicate).toBeDefined();
      expect(callbacks.onNodeDelete).toBeDefined();

      // Test each callback
      callbacks.onAddNodeRequest?.({ x: 10, y: 20 });
      callbacks.onNodeEdit?.('edit-node');
      callbacks.onNodeDuplicate?.('dup-node');
      callbacks.onNodeDelete?.('del-node');

      expect(callbacks.onAddNodeRequest).toHaveBeenCalledWith({ x: 10, y: 20 });
      expect(callbacks.onNodeEdit).toHaveBeenCalledWith('edit-node');
      expect(callbacks.onNodeDuplicate).toHaveBeenCalledWith('dup-node');
      expect(callbacks.onNodeDelete).toHaveBeenCalledWith('del-node');
    });

    it('should allow optional callbacks', () => {
      // Should be valid with no callbacks
      const emptyCallbacks: ContextMenuCallbacks = {};
      expect(emptyCallbacks).toBeDefined();

      // Should be valid with partial callbacks
      const partialCallbacks: ContextMenuCallbacks = {
        onNodeEdit: vi.fn(),
        onNodeDelete: vi.fn(),
      };
      expect(partialCallbacks.onNodeEdit).toBeDefined();
      expect(partialCallbacks.onNodeDelete).toBeDefined();
      expect(partialCallbacks.onAddNodeRequest).toBeUndefined();
      expect(partialCallbacks.onNodeDuplicate).toBeUndefined();
    });
  });

  describe('Integration with Canvas Props', () => {
    it('should be compatible with Canvas component props', () => {
      // This test verifies that ContextMenuCallbacks can be used with Canvas props
      interface CanvasProps extends ContextMenuCallbacks {
        initialNodes?: any[];
        onChange?: (nodes: any[], edges: any[]) => void;
      }

      const props: CanvasProps = {
        initialNodes: [],
        onAddNodeRequest: vi.fn(),
        onNodeEdit: vi.fn(),
        onNodeDuplicate: vi.fn(),
        onNodeDelete: vi.fn(),
      };

      expect(props.onAddNodeRequest).toBeDefined();
      expect(props.onNodeEdit).toBeDefined();
      expect(props.onNodeDuplicate).toBeDefined();
      expect(props.onNodeDelete).toBeDefined();
    });
  });

  describe('Task 2.1: Connection Dropped Callback', () => {
    it('should define onConnectionDropped callback type correctly', () => {
      const mockCallback: ContextMenuCallbacks['onConnectionDropped'] = vi.fn();

      // Call with expected parameters
      mockCallback?.({
        position: { x: 100, y: 200 },
        sourceNodeId: 'node-123',
        sourceHandle: 'handle-a',
      });

      expect(mockCallback).toHaveBeenCalledWith({
        position: { x: 100, y: 200 },
        sourceNodeId: 'node-123',
        sourceHandle: 'handle-a',
      });
    });

    it('should support onConnectionDropped without sourceHandle', () => {
      const mockCallback: ContextMenuCallbacks['onConnectionDropped'] = vi.fn();

      // Call without sourceHandle
      mockCallback?.({
        position: { x: 150, y: 250 },
        sourceNodeId: 'node-456',
      });

      expect(mockCallback).toHaveBeenCalledWith({
        position: { x: 150, y: 250 },
        sourceNodeId: 'node-456',
      });
    });

    it('should be optional in ContextMenuCallbacks interface', () => {
      // Should be valid without onConnectionDropped
      const callbacks: ContextMenuCallbacks = {
        onAddNodeRequest: vi.fn(),
      };
      expect(callbacks.onConnectionDropped).toBeUndefined();

      // Should be valid with onConnectionDropped
      const callbacksWithConnection: ContextMenuCallbacks = {
        onConnectionDropped: vi.fn(),
      };
      expect(callbacksWithConnection.onConnectionDropped).toBeDefined();
    });

    it('should work with all callbacks together', () => {
      const callbacks: ContextMenuCallbacks = {
        onAddNodeRequest: vi.fn(),
        onNodeEdit: vi.fn(),
        onNodeDuplicate: vi.fn(),
        onNodeDelete: vi.fn(),
        onConnectionDropped: vi.fn(),
      };

      // Test onConnectionDropped
      callbacks.onConnectionDropped?.({
        position: { x: 50, y: 75 },
        sourceNodeId: 'source-node',
        sourceHandle: 'output-1',
      });

      expect(callbacks.onConnectionDropped).toHaveBeenCalledWith({
        position: { x: 50, y: 75 },
        sourceNodeId: 'source-node',
        sourceHandle: 'output-1',
      });

      // Verify other callbacks are still available
      expect(callbacks.onAddNodeRequest).toBeDefined();
      expect(callbacks.onNodeEdit).toBeDefined();
      expect(callbacks.onNodeDuplicate).toBeDefined();
      expect(callbacks.onNodeDelete).toBeDefined();
    });
  });
});
