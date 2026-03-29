# ADR 004 — Trunk-Based Development with GitHub Pages Deployment

## Status
Accepted

## Context
The project needs a deployment target and a git workflow. Options: feature branches with PRs vs trunk-based; GitHub Pages vs Netlify/Vercel vs self-hosted.

## Decision
Commit directly to `main` (trunk-based development) and deploy automatically to GitHub Pages on every push.

## Rationale
- Single-developer project: PR overhead adds no review benefit
- Trunk-based keeps history linear and simple
- GitHub Pages is free, zero-config for public repos, and integrates natively with GitHub Actions
- No backend means a static host is sufficient — no need for Netlify/Vercel features

## Consequences
- Every push to `main` triggers CI (lint + test + build) before deploy — the pipeline is the safety net
- Pre-commit hooks (husky) catch failures locally before they reach CI
- GitHub Pages serves from `dist/` via the `actions/upload-pages-artifact` + `actions/deploy-pages` action pair
