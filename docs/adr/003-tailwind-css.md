# ADR 003 — Tailwind CSS for Styling

## Status
Accepted

## Context
The app needs a clean, minimal UI (spec section 5). Options considered: Tailwind CSS, plain CSS modules, a component library (e.g. shadcn/ui).

## Decision
Use Tailwind CSS utility classes, applied directly in JSX.

## Rationale
- No context switching between JSX and separate `.css` files for a small app
- Utility classes map 1:1 to design decisions, making layout easy to read in the component tree
- Tailwind's purge step keeps the production CSS small (~10 kB)
- No design system opinions to override — straightforward to stay minimal

## Consequences
- Class strings can become long for complex components — acceptable at this scale
- Requires PostCSS pipeline (already present via Vite)
- A full component library would have added more polish but also more bundle weight and configuration
