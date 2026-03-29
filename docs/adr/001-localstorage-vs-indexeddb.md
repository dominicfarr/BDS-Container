# ADR 001 — localStorage over IndexedDB

## Status
Accepted

## Context
The app needs client-side persistence for workflow observations with no backend. Two main browser options: `localStorage` (synchronous key-value store) and `IndexedDB` (asynchronous, structured database).

## Decision
Use `localStorage`.

## Rationale
- Data volume is small (a few workflows, each with < 100 rows of short text fields)
- Synchronous API simplifies React state sync — no async plumbing needed
- Zero dependencies; works in all modern browsers
- Easier to debug (visible in DevTools → Application → Storage)

## Consequences
- localStorage is limited to ~5 MB per origin — sufficient for this use case
- Data is not shared across devices or browsers (acceptable: spec says "No data sync")
- Synchronous writes block the main thread, but payloads are tiny so this is imperceptible
