# Technical Debt Documentation

This document outlines the current technical debt in the Virgin Fund codebase, focusing on error handling patterns, CSS architecture, and other potential issues that should be addressed.

## Error Handling Patterns

### 1. TypeBox Error Handling

The codebase uses the `@sinclair/typebox` library for validation, which has multiple error handling implementations scattered throughout the codebase. This creates several issues:

- Error messages are created in multiple different places with inconsistent formatting
- The `DefaultErrorFunction` is implemented in several locations with duplicated code
- Error handling logic is tightly coupled with the validation logic

#### Examples:

```js
function DefaultErrorFunction(error) {
    // Case statements repeated in multiple files with slight variations
    case ValueErrorType.ObjectRequiredProperty:
        return 'Expected required property';
}
```

### 2. Inconsistent Error Reporting

The error handling pattern in the portfolio asset manager component is different from other parts of the application:

```js
try {
  // ...operation
} catch (err) {
  console.error("Error fetching assets:", err)
  setError(err.message || "Failed to load assets")
} finally {
  setLoading(false)
}
```

While other parts of the code use different patterns:

```js
if (!check) {
  throw new Error(message);
}
```

### 3. Missing Error Boundaries

The React components don't appear to use Error Boundaries consistently, meaning runtime errors can crash the entire application rather than being contained to the failing component.

## CSS Architecture Issues

### 1. Duplicated CSS Output

The build process is generating multiple CSS chunks with duplicated styles:

- `styles_globals_b52d8e88.css`
- `[root of the server]__c5f1b77e._.css` 

These files contain many identical CSS rules, increasing the overall bundle size and potentially causing performance issues.

### 2. CSS Variable Inconsistency

The theming system uses CSS variables, but there are inconsistencies in how they're defined and used:

```css
/* In one file */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... */
}

/* In another file */
:root {
  --background: var(--brand-50);
  --foreground: var(--brand-900);
  /* ... */
}
```

This inconsistency makes theme changes difficult and error-prone.

### 3. Tailwind Utility Explosion

The codebase heavily uses Tailwind CSS, which has resulted in an explosion of utility classes. The generated CSS files contain thousands of utility classes, many of which might not be used in the actual application:

```css
.w-\[1\.2rem\] {
  width: 1.2rem;
}

.w-\[100px\] {
  width: 100px;
}

.w-\[120px\] {
  width: 120px;
}

.w-\[180px\] {
  width: 180px;
}

.w-\[1px\] {
  width: 1px;
}
```

### 4. Complex Selector Patterns

The CSS includes extremely complex selector patterns that are difficult to maintain and likely impact performance:

```css
.\[\&\:has\(\[aria-selected\]\.day-outside\)\]\:bg-accent\/50:has([aria-selected].day-outside) {
  background-color: #ffcc0080;
}

[data-side="left"][data-state="collapsed"] .\[\[data-side\=left\]\[data-state\=collapsed\]_\&\]\:cursor-e-resize {
  cursor: e-resize;
}
```

### 5. Multiple Theme Implementation Methods

The codebase uses multiple methods for implementing dark mode and theming:

```css
/* Method 1: Using class-based dark mode */
.dark {
  --background: var(--brand-900);
  --foreground: var(--brand-50);
}

/* Method 2: Using the :is() pseudo-class for dark mode */
.dark\:bg-slate-900\/50:is(.dark *) {
  background-color: #0f172a80;
}
```

This lack of consistency makes theme maintenance difficult.

## Build System Issues

### 1. Generated Code Duplication

The Next.js build process is generating duplicate code chunks, particularly around error handling:

- Multiple implementations of the same error functions in different generated files
- Same error types defined in multiple places
- Redundant error formatting logic

For example, the same `ValueErrorType` enums and error handling functions appear in:
- `6f812_@sinclair_typebox_build_esm_5d2f6ec1._.js`
- `6f812_@sinclair_typebox_build_esm_6eb33d2e._.js`
- And other generated files

### 2. Import Bloat

The imports in the generated files are excessively verbose and potentially causing performance issues:

```js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sinclair$2b$typebox$40$0$2e$32$2e$35$2f$node_modules$2f40$sinclair$2f$typebox$2f$build$2f$esm$2f$errors$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sinclair+typebox@0.32.35/node_modules/@sinclair/typebox/build/esm/errors/errors.mjs [app-client] (ecmascript)");
```

### 3. Media Query Duplication

The generated CSS contains duplicated media query blocks, which can impact CSS parsing and application performance:

```css
@media (width >= 768px) {
  /* Duplicated media query content */
}

/* Many lines later */
@media (width >= 768px) {
  /* More duplicated media query content */
}
```

## Recommendations

### 1. Unified Error Handling

Create a centralized error handling service that:
- Provides consistent error formatting
- Wraps TypeBox validation errors
- Offers user-friendly error messages
- Includes error logging

```ts
// Example of a centralized error handler
export class AppError extends Error {
  constructor(message: string, public code: string, public userMessage?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  handleValidationError(error) {
    // Consistent handling
  },
  handleAPIError(error) {
    // API error handling
  }
};
```

### 2. React Error Boundaries

Implement React Error Boundaries around key application components:

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

### 3. CSS Architecture Improvements

1. **Consolidate CSS Variables**
   - Create a single source of truth for CSS variables
   - Document the theming system with clear explanations of each variable's purpose

2. **Optimize Tailwind Configuration**
   - Use Tailwind's purge configuration to eliminate unused utility classes
   - Consider grouping common utilities into component classes
   - Set up Tailwind to generate only the utilities actually used in the codebase

3. **Simplify Complex Selectors**
   - Replace complex attribute selectors with more maintainable class-based approaches
   - Consider a more component-based approach rather than relying heavily on complex CSS selectors

4. **Standardize Theme Implementation**
   - Choose a single method for theme implementation (class-based or CSS variables)
   - Document the theming system for developers

### 4. Build Optimization

1. Review the Next.js configuration to reduce code duplication
2. Consider implementing tree-shaking optimization for error handling code
3. Create custom TypeBox error handlers that are more lightweight
4. Configure CSS splitting and merging more effectively to prevent duplication

### 5. Consistent API Error Handling

Implement a pattern for API error handling that includes:
- HTTP status code mapping
- Structured error responses
- Client-side error transformation

```ts
// API client with consistent error handling
async function apiRequest(endpoint, options) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      const error = await response.json();
      throw new AppError(
        error.message || 'API request failed',
        error.code || 'API_ERROR',
        error.userMessage || 'Something went wrong, please try again'
      );
    }
    return await response.json();
  } catch (err) {
    errorHandler.handleAPIError(err);
    throw err;
  }
}
```

## Conclusion

The technical debt in the codebase spans multiple areas including error handling, CSS architecture, and build optimization. By implementing the recommended improvements, we can enhance maintainability, improve performance, and provide a more consistent developer experience.

The CSS architectural issues deserve special attention, as they directly impact both performance and maintainability. Consolidating the CSS approach will make the codebase more maintainable and could significantly reduce the bundle size.
