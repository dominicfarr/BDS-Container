# ADR 002 — React over Svelte and Vanilla JS

## Status
Accepted

## Context
The spec listed React, Svelte, and vanilla JS as candidates for the UI layer.

## Decision
Use React (with Vite).

## Rationale
- Widest ecosystem and tooling support (Testing Library, Jest integration, DevTools)
- `@testing-library/react` enables the integration-test strategy required by the spec
- React hooks (`useState`, `useEffect`) map cleanly onto the localStorage sync pattern
- Familiarity: reduces ramp-up time for contributors

## Consequences
- Larger bundle than Svelte (~148 kB vs ~20 kB gzipped) — acceptable for a tool used internally
- JSX requires a build step (Vite handles this with zero config)
- Svelte would have produced smaller output but would have required different test tooling
