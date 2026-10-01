# ATS Dashboard

React + Vite + JavaScript + Tailwind CSS dashboard for the ATS /
energy-management system.

## Project Documentation

Before implementing features, read the project documentation relevant to
the task.

Core documentation:

-   `docs/Project/01_PROJECT_OVERVIEW.md`
-   `docs/Project/02_SYSTEM_ARCHITECTURE.md`
-   `docs/Project/03_FUNCTIONAL_REQUIREMENTS.md`
-   `docs/Project/04_DATA_CONTRACT.md`
-   `docs/Project/05_FRONTEND_ARCHITECTURE.md`
-   `docs/Project/06_AUTH_AND_FEATURE_FLAGS.md`
-   `docs/Project/07_INTEGRATION_PLAN.md`
-   `docs/Project/08_ATS_FULL_DEVELOPMENT_PLAN.md`
-   `docs/Project/09_DEVELOPMENT_ROADMAP.md`
-   `docs/Project/10_REPOSITORY_STRUCTURE.md`
-   `docs/Project/SPEC.md`

Flow verification:

-   `docs/SmokeTest.md`

## Agent Entry Rule

AI coding agents must read `docs/Agents/10_AGENT_INSTRUCTIONS.md` before
making implementation changes.

The agent must also read the documentation relevant to the requested
task before coding.

## Development Principles

-   React + Vite + JavaScript.
-   Tailwind CSS.
-   No TypeScript.
-   No Bootstrap.
-   No invented production integration behavior.
-   No hardcoded production telemetry.
-   Mock data is acceptable during frontend development.
-   Keep integration behind service/adaptor boundaries.
-   Keep access control centralized.
-   Keep feature flags centralized.
-   Preserve responsive behavior.
-   Follow the animation requirements in `SPEC.md`.
-   Make small, focused changes.
-   Keep commits small and logically separated.

## Smoke Testing

Important user flows are documented in:

`docs/SmokeTest.md`

When a new feature changes an important user flow, update the smoke-test
documentation.

## Current Integration Status

The production frontend integration method is not assumed until it is
confirmed from the existing ATS / Node-RED system.

Do not invent:

-   MQTT topics
-   Modbus registers
-   API endpoints
-   WebSocket payloads
-   command formats
-   authentication behavior
-   device credentials

Use the documented application-level data contract and mock adapters
while integration details remain unconfirmed.
