# W6W Editor - Development Context

## Project Overview
This is the **W6W Editor** monorepo - a visual workflow editor built as an open-source React component library.

## Architecture

### Monorepo Structure
This repository uses a monorepo structure with multiple workspaces:
- **Core Editor**: The main visual canvas and workflow editing component
- **Component Library**: Reusable workflow nodes and UI components
- **Examples**: Example implementations and demos
- **Documentation**: API docs and guides

### Technology Stack

- **Framework**: React 19.2+ (latest stable)
- **Language**: TypeScript 5.9+ (strict mode)
- **State Management**: Redux Toolkit (latest)
- **Build Tool**: Vite 7+ (recommended) or Turbopack
- **Package Manager**: pnpm 10+ (recommended)
- **Monorepo Tool**: Turborepo (recommended) or Nx

## Design Principles

1. **Open Source First**: All code should be production-ready and well-documented for public consumption
2. **Developer Experience**: Prioritize DX with excellent TypeScript support and clear APIs
3. **Performance**: Optimize for large workflows with thousands of nodes
4. **Extensibility**: Plugin architecture for custom nodes and integrations
5. **Accessibility**: WCAG 2.1 AA compliance for all interactive elements

## Development Guidelines

### Code Style
- Use functional components with hooks
- Prefer composition over inheritance
- Write self-documenting code with clear naming
- Add JSDoc comments for public APIs
- Keep components small and focused

### State Management
- Use Redux Toolkit for global workflow state
- Local component state with useState/useReducer where appropriate
- Memoize expensive computations with useMemo/useCallback

### Testing
- Unit tests for business logic
- Component tests with React Testing Library
- E2E tests for critical user flows

## Key Features to Implement

- [ ] Canvas with pan/zoom capabilities
- [ ] Drag-and-drop node placement
- [ ] Connection system for linking nodes
- [ ] Node configuration panels
- [ ] Undo/redo functionality
- [ ] Workflow validation
- [ ] Export/import workflows (JSON)
- [ ] Minimap for navigation
- [ ] Keyboard shortcuts
- [ ] Multi-select and bulk operations

## Related Repositories
- **Parent Project**: [w6w](../) - Main W6W project containing this editor and other tools

## Notes for AI Assistants

When working on this codebase:
- Prioritize clean, maintainable code suitable for open-source
- Consider bundle size and performance implications
- Ensure all new features are accessible
- Write comprehensive documentation for new APIs
- Follow the established patterns and conventions
- Test cross-browser compatibility
- Consider mobile/touch interactions for the canvas
