# Angular Health Insurance Call Center Application

This is an Angular 18+ application for a Health Insurance Company's call center system.

## Project Features
- ✅ Angular 18+ with standalone components
- ✅ TypeScript configuration
- ✅ HTML/CSS template files for components
- ✅ Angular environments (development, GitHub Pages, production)
- ✅ GitHub Actions for CI/CD
- ✅ Playwright testing setup
- ✅ Git integration
- ✅ Service layer with mock data
- ✅ Keyboard/mouse navigation support
- ✅ Member lookup functionality
- ✅ Call tracking from start to finish
- ✅ GitHub Pages deployment with test failure handling

## Development Guidelines
You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

### TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
- `NgOptimizedImage` does not work for inline base64 images.

### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

### State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

### Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Structure
- `/src/app/components/` - Angular standalone components
- `/src/app/services/` - Service layer for data access
- `/src/app/models/` - TypeScript interfaces and types
- `/src/environments/` - Environment configurations
- `/e2e/` - Playwright tests
- `/.github/workflows/` - GitHub Actions