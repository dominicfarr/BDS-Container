# Audit Observation Form - Specification

## 0. Infrastructure Setup (do first, before any code)

Complete these steps before writing any CI/CD workflow or pushing any code.

- [ ] Create repo and set visibility to public
- [ ] Enable GitHub Pages via CLI:
  ```
  gh api repos/{owner}/{repo}/pages --method POST -f build_type=workflow
  ```
- [ ] Confirm Pages source is set to "GitHub Actions" in repo Settings → Pages
- [ ] Verify `gh auth status` has sufficient scopes (repo, pages)

> **Why first:** The deploy workflow will fail on its very first run with a 404 if Pages is not enabled. This is a prerequisite, not a post-deploy step.

---

## 1. Purpose

Capture workflow observations during client audits using structured format
(Step, Action, Input/Source, Tool, Output, Notes).

## 2. Features

- Create and switch between multiple workflows
- Add/edit/delete observation rows
- Auto-save to browser localStorage
- Download observations as CSV
- Character count for Notes field

## 3. Data Structure

| Column       | Type           | Size      | Required        |
| ------------ | -------------- | --------- | --------------- |
| Step         | Auto-increment | N/A       | Yes (read-only) |
| Action       | Text input     | 100 chars | Yes             |
| Input/Source | Text input     | 100 chars | Yes             |
| Tool         | Text input     | 100 chars | Yes             |
| Output       | Text input     | 100 chars | Yes             |
| Notes        | Textarea       | 500 chars | No              |

## 4. User Flow

1. Select or create workflow name
2. Click "Add Row"
3. Fill Action, Input/Source, Tool, Output (required)
4. Fill Notes (optional)
5. Auto-save to localStorage
6. Download CSV when complete

## 5. UI Requirements

- Minimal, clean design
- Workflow selector dropdown
- Table with add/delete/edit row options
- Character count display for Notes
- Download button
- Mobile-friendly layout

## 6. Storage

- Browser localStorage (no backend)
- Auto-save on input change
- CSV export capability
- No data sync

## 7. Tech Stack

- React or Svelte
- Tailwind CSS
- Node.js 18+

## 8. Acceptance Criteria (BDD)

```gherkin
Feature: Audit Observation Capture

Scenario: Create new workflow
  Given I open the form
  When I enter workflow name "Cameron - Takeoff"
  And I click "New Workflow"
  Then the form is ready to capture observations

Scenario: Add observation row
  Given I have an active workflow
  When I click "Add Row"
  Then a new empty row appears with auto-numbered step

Scenario: Fill required fields
  Given I have a new row
  When I enter Action, Input/Source, Tool, Output
  Then the row is saved to localStorage

Scenario: Notes field is optional
  Given I have a new row with required fields filled
  When I leave Notes empty
  Then the row saves successfully

Scenario: Character count on Notes
  Given I'm typing in Notes field
  When I enter text
  Then "X / 500 chars" displays below field

Scenario: Delete row
  Given I have captured rows
  When I click delete on a row
  Then it's removed from storage

Scenario: Download CSV
  Given I have completed observations
  When I click "Download CSV"
  Then a CSV file downloads with all rows
```

## 9. Development Standards

### Testing

- Unit tests: Component logic (Jest)
- Integration tests: Form + localStorage (React Testing Library)
- E2E tests: Full user flow (Playwright)

#### E2E Test Rules
- Use Playwright-native locators only — do not use Testing Library APIs (`getByDisplayValue`, etc.)
- Prefer `getByRole()` over `getByText()` to avoid strict mode violations when text appears in multiple elements (e.g. both a heading and a dropdown option)
- E2E tests must pass in CI before the spec is considered done
- If browser deps are unavailable locally, verify via `gh run watch` after each push

### Code Quality

- Linting: ESLint
- Formatting: Prettier
- Pre-commit hooks: husky + lint-staged

### CI Discipline

- After every `git push`, immediately run:
  ```
  gh run watch <run-id> --repo {owner}/{repo}
  ```
- Do not consider any task done until CI is green
- If CI fails, diagnose immediately with `gh run view --log-failed` before moving on

### Git Workflow (Trunk-Based)

- Commit to main directly (after local validation)
- Conventional commits: `feat(form): add rows`, `fix(csv): handle quotes`
- Pre-commit hooks run: lint, format, test
- CI/CD runs same checks before deploy

### TDD Approach

- Write BDD scenario first
- Write failing tests
- Write minimal code to pass
- Refactor for clarity

### Architecture Decisions

Document non-obvious choices in `/docs/adr/`:

- Why localStorage over IndexedDB?
- Why React vs Svelte vs vanilla?
- Why Tailwind?
- Any other key decisions

## 10. Deployment

- Host: GitHub Pages
- Deploy: Automatic on push to main
- Build: `npm run build`
- No backend, no API, no CLI

> **Prerequisite:** GitHub Pages must be enabled before the first push (see Section 0).

## 11. Progress Tracking

- GitHub Project board (tied to repo)
- Columns: To Do, In Progress, Done
- Issues/PRs linked to board

## 12. Definition of Done

- [ ] Infrastructure setup complete (Section 0)
- [ ] All BDD scenarios pass
- [ ] Tests pass (unit + integration + E2E)
- [ ] E2E tests verified green in CI via `gh run watch`
- [ ] Linting clean
- [ ] CSV download works
- [ ] Deployed to GitHub Pages
- [ ] ADRs documented
