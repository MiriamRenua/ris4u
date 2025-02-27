# RIS4U Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run all tests
- `npm run test <test-file-path>` - Run specific test

## Tech Stack
- Vue 3 with Composition API
- TypeScript
- Vite for bundling
- Vitest for testing

## Code Style

### Component Structure
- Single file components (.vue)
- Template first, script second, style third
- Use `<script setup lang="ts">` for Composition API
- Scoped styles with `<style scoped>`

### TypeScript
- Strong typing with explicit interfaces/types
- Types in separate files under `/src/types/`
- Use proper type annotations for props, emits, and refs

### Naming Conventions
- PascalCase for components
- camelCase for variables, methods, props
- Descriptive, semantic naming

### Imports
- Group imports by type (Vue, components, types)
- Order: Vue core, external libs, internal components, types

### Error Handling
- Use try/catch for async operations
- Log errors to console with descriptive messages
- Provide user-friendly error states in UI

### State Management
- Prefer component-local state with `ref`/`reactive`
- Use `computed` properties for derived state
- Pass props down, emit events up

### Styling
- Responsive design with mobile breakpoints
- CSS variables for colors and spacing
- BEM-like class naming (.block__element--modifier)

### Documentation
- Document complex functions with JSDoc
- Include type information in comments