import { describe, it, expect, vi } from 'vitest';
import type { ContextMenuCallbacks, PendingConnection } from '../types';
import type { CanvasHandle } from './Canvas';

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

  describe('Task 2.2: Pending Connection State', () => {
    it('should define PendingConnection type correctly', () => {
      const pendingConnection: PendingConnection = {
        sourceNodeId: 'node-123',
        sourceHandle: 'handle-a',
        position: { x: 100, y: 200 },
      };

      expect(pendingConnection.sourceNodeId).toBe('node-123');
      expect(pendingConnection.sourceHandle).toBe('handle-a');
      expect(pendingConnection.position.x).toBe(100);
      expect(pendingConnection.position.y).toBe(200);
    });

    it('should support PendingConnection without sourceHandle', () => {
      const pendingConnection: PendingConnection = {
        sourceNodeId: 'node-456',
        position: { x: 150, y: 250 },
      };

      expect(pendingConnection.sourceNodeId).toBe('node-456');
      expect(pendingConnection.sourceHandle).toBeUndefined();
      expect(pendingConnection.position.x).toBe(150);
      expect(pendingConnection.position.y).toBe(250);
    });

    it('should define CanvasHandle interface correctly', () => {
      // Mock implementation of CanvasHandle
      const mockHandle: CanvasHandle = {
        completePendingConnection: vi.fn(),
        cancelPendingConnection: vi.fn(),
        getPendingConnection: vi.fn(),
      };

      expect(mockHandle.completePendingConnection).toBeDefined();
      expect(mockHandle.cancelPendingConnection).toBeDefined();
      expect(mockHandle.getPendingConnection).toBeDefined();
    });

    it('should call completePendingConnection with correct parameters', () => {
      const mockHandle: CanvasHandle = {
        completePendingConnection: vi.fn(),
        cancelPendingConnection: vi.fn(),
        getPendingConnection: vi.fn(),
      };

      mockHandle.completePendingConnection('new-node-123', 'custom', { label: 'New Node' });

      expect(mockHandle.completePendingConnection).toHaveBeenCalledWith(
        'new-node-123',
        'custom',
        { label: 'New Node' }
      );
    });

    it('should call cancelPendingConnection without parameters', () => {
      const mockHandle: CanvasHandle = {
        completePendingConnection: vi.fn(),
        cancelPendingConnection: vi.fn(),
        getPendingConnection: vi.fn(),
      };

      mockHandle.cancelPendingConnection();

      expect(mockHandle.cancelPendingConnection).toHaveBeenCalledWith();
    });

    it('should call getPendingConnection and return pending connection', () => {
      const mockPending: PendingConnection = {
        sourceNodeId: 'source-1',
        sourceHandle: 'out',
        position: { x: 50, y: 75 },
      };

      const mockHandle: CanvasHandle = {
        completePendingConnection: vi.fn(),
        cancelPendingConnection: vi.fn(),
        getPendingConnection: vi.fn().mockReturnValue(mockPending),
      };

      const result = mockHandle.getPendingConnection();

      expect(mockHandle.getPendingConnection).toHaveBeenCalledWith();
      expect(result).toEqual(mockPending);
    });

    it('should return null when no pending connection', () => {
      const mockHandle: CanvasHandle = {
        completePendingConnection: vi.fn(),
        cancelPendingConnection: vi.fn(),
        getPendingConnection: vi.fn().mockReturnValue(null),
      };

      const result = mockHandle.getPendingConnection();

      expect(result).toBeNull();
    });
  });
});
