# 10. Agent Instructions

## Purpose

This document defines how AI coding agents must work inside the ATS
Dashboard repository.

The repository is built incrementally. Agents must make small,
reviewable changes rather than attempting large batches of
implementation.

## Required Project Context

Before changing code, read these documents when relevant:

1.  `docs/Project/01_PROJECT_OVERVIEW.md`
2.  `docs/Project/02_SYSTEM_ARCHITECTURE.md`
3.  `docs/Project/03_FUNCTIONAL_REQUIREMENTS.md`
4.  `docs/Project/04_DATA_CONTRACT.md`
5.  `docs/Project/05_FRONTEND_ARCHITECTURE.md`
6.  `docs/Project/06_AUTH_AND_FEATURE_FLAGS.md`
7.  `docs/Project/07_INTEGRATION_PLAN.md`
8.  `docs/Project/08_ATS_FULL_DEVELOPMENT_PLAN.md`
9.  `docs/Project/09_DEVELOPMENT_ROADMAP.md`
10. `docs/Project/10_REPOSITORY_STRUCTURE.md`
11. `docs/Project/SPEC.md`

If a required document does not exist yet, do not invent its contents.
Work from the documents that are available and identify missing
decisions clearly.

## Core Rules

-   Use React + Vite + JavaScript.
-   Use Tailwind CSS.
-   Do not introduce TypeScript.
-   Do not introduce Bootstrap.
-   Do not introduce another frontend framework without an explicit
    project decision.
-   Do not hardcode production telemetry, tariffs, financial values,
    device states, or user permissions.
-   Mock data is allowed for development, but it must be clearly
    separated from the production integration layer.
-   Do not connect the frontend directly to physical devices.
-   Do not assume `/ws/telemetry` is the final frontend integration
    method.
-   Do not invent undocumented Node-RED, MQTT, Modbus, or device command
    behavior.
-   Preserve responsive behavior across desktop, laptop, tablet, and
    small screens.
-   Follow the animation and motion rules in `SPEC.md`.

## Small Commit Rule

Agents MUST work in small commits.

A commit should normally represent one logical change.

Good examples:

-   `chore: scaffold vite app`
-   `chore: configure tailwind`
-   `feat: add application shell`
-   `feat: add dashboard navigation`
-   `feat: add mock telemetry adapter`
-   `feat: add dashboard summary cards`
-   `feat: add source status panel`
-   `fix: correct mobile navigation overflow`
-   `docs: update integration assumptions`

Avoid commits such as:

-   `feat: build entire dashboard`
-   `feat: finish frontend`
-   `feat: add all pages and backend`
-   Any commit containing many unrelated features

## Commit Boundary

Before making a commit:

1.  Run `git status`.
2.  Review the changed files.
3.  Confirm the change represents one logical task.
4.  Run the relevant validation command.
5.  Review the diff with `git diff`.
6.  Commit only the intended files.

Do not automatically commit unrelated generated files, temporary files,
screenshots, logs, or editor artifacts.

## Change Size

Prefer:

-   One component or small component group.
-   One service or adapter.
-   One page section.
-   One focused responsive fix.
-   One focused animation.
-   One documentation update.

If a task becomes large, split it into smaller tasks and commits.

Do not continue adding features simply because the current task has not
produced an error.

## Before Coding

Before implementation:

1.  Identify the exact requirement.
2.  Identify the relevant specification document.
3.  Inspect the existing code.
4.  Check whether the required architecture already exists.
5.  Determine the smallest safe change.
6.  State any unresolved assumption in the implementation notes or
    documentation.

## During Coding

-   Reuse existing components and utilities when appropriate.
-   Avoid duplicate logic.
-   Keep integration code behind service/adaptor boundaries.
-   Keep access control logic centralized.
-   Keep feature-flag evaluation centralized.
-   Keep mock data behind the same interfaces expected by live data.
-   Prefer configuration over hardcoded values.
-   Do not silently change UI behavior outside the requested task.
-   Do not redesign unrelated screens while fixing a local issue.

## Access Control

The project uses three related concepts:

-   Page access: controls whether a page/navigation item is available.
-   Action access: controls whether a user can perform a specific
    action.
-   Feature access: controls whether a feature or dashboard section
    exists for that user.

Rules:

-   If page access is missing, hide the navigation item and protect the
    route.
-   If action access is missing, hide the relevant action. Do not show
    unauthorized actions as disabled controls.
-   If feature access is missing, do not render the restricted feature
    or dashboard section.
-   Admin-only feature management must remain protected.
-   UI visibility is not a security boundary. Server-side enforcement is
    required when live backend integration is implemented.

## Dashboard Rule

The dashboard is a standard page for users who have dashboard access.

However, individual dashboard sections and data can be
feature-dependent.

Agents must not assume that every user sees every dashboard section.

## Integration Rules

Until the live integration contract is confirmed:

-   Use the application-level data contract defined in
    `04_DATA_CONTRACT.md`.
-   Use mock adapters for UI development.
-   Keep transport-specific code isolated.
-   Do not fabricate live MQTT topics, Modbus registers, HTTP endpoints,
    WebSocket payloads, or command formats.
-   Do not expose device credentials or secrets in frontend code.

## Animation Rules

Animation is part of the product design, not decoration.

Use:

-   `thinking-orbs` for meaningful processing, connection, loading, or
    analysis states.
-   Transitions.dev patterns where appropriate and compatible with the
    project.
-   Custom power-flow animation for the ATS energy-flow visualization.

Do not:

-   Animate every element continuously.
-   Add motion that makes telemetry harder to read.
-   Use animation as a substitute for clear status information.
-   ignore reduced-motion preferences.

## Validation

For each focused change, run the smallest useful validation.

Typical commands:

``` bash
npm run build
```

For linting when configured:

``` bash
npm run lint
```

For tests when configured:

``` bash
npm test
```

For UI changes, also inspect the affected screen at relevant responsive
widths.

## Documentation Updates

Update documentation when a development decision changes:

-   architecture
-   data contract
-   integration method
-   authentication model
-   permissions
-   feature flags
-   repository structure
-   animation system
-   deployment approach

Do not rewrite documentation unnecessarily for ordinary implementation
details.

## Smoke-Test Documentation

The repository must contain `docs/SmokeTest.md`.

When the documentation structure is being established, the agent must
create `docs/SmokeTest.md`. This document must contain straightforward,
human-readable flow tests for the application. It is a simple
flow-verification document, not a detailed automated testing
implementation or a collection of detailed unit-test cases.

Smoke tests must focus on critical user flows and cover the following as
applicable:

-   application startup
-   dashboard access
-   navigation
-   page access restrictions
-   action-level access restrictions
-   feature-flag behavior
-   dashboard feature visibility
-   mock telemetry rendering
-   source/status display
-   alerts
-   HMI flow
-   responsive navigation and layout
-   loading and error states

Each smoke test must include:

-   a test name
-   prerequisites when necessary
-   simple steps
-   the expected result

Write every smoke test in straightforward language that a human can
follow manually. Keep each test small and focused, consistent with the
project's small-commit rule.

Whenever a completed feature introduces or changes an important user
flow, update `docs/SmokeTest.md` as part of that logical change. Do not
invent production behavior that has not been confirmed by the project
documentation; mark unresolved behavior as TBD instead.

## Unknowns

If the existing system does not provide enough information:

-   Do not guess.
-   Mark the item as TBD.
-   Continue with mock or interface-level implementation when safe.
-   Record what information is required to finalize the integration.

## Definition of Good Agent Work

A good agent change is:

-   small
-   understandable
-   testable
-   reversible
-   documented when necessary
-   consistent with the architecture
-   responsive
-   free from invented production behavior
-   committed separately when it represents a distinct logical change

The goal is steady progress with a clean Git history, not one enormous
commit containing the entire human condition.
