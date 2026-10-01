# 10. Repository Structure

## Purpose

This document defines the intended repository organization for the ATS
Dashboard.

The structure should keep UI, data access, access control,
configuration, and reusable utilities separated.

This document is the authoritative repository structure. Where other
project documents describe a different file or folder layout, this
document takes precedence.

Do not create folders or files simply because they might be useful
later. Add structure when it has a real implementation purpose.

## Root Structure

```text
ats-dashboard/
├── docs/
│   ├── Agents/
│   │   ├── 10_AGENT_INSTRUCTIONS.md
│   │   └── CLAUDE.md
│   ├── Project/
│   │   ├── 01_PROJECT_OVERVIEW.md
│   │   ├── 02_SYSTEM_ARCHITECTURE.md
│   │   ├── 03_FUNCTIONAL_REQUIREMENTS.md
│   │   ├── 04_DATA_CONTRACT.md
│   │   ├── 05_FRONTEND_ARCHITECTURE.md
│   │   ├── 06_AUTH_AND_FEATURE_FLAGS.md
│   │   ├── 07_INTEGRATION_PLAN.md
│   │   ├── 08_ATS_FULL_DEVELOPMENT_PLAN.md
│   │   ├── 09_DEVELOPMENT_ROADMAP.md
│   │   ├── 10_REPOSITORY_STRUCTURE.md
│   │   └── SPEC.md
│   └── SmokeTest.md
│
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── .gitignore
├── CLAUDE.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The exact generated Vite files may differ slightly depending on the
installed Vite version.

## `docs/`

Contains agent guidance, project documentation, and verification
documentation that is not part of the application runtime.

### `docs/Agents/`

Contains instructions for AI coding agents working in the repository.

`docs/Agents/CLAUDE.md` is the authoritative agent instruction file. The
root `CLAUDE.md` only points to it so that Claude Code discovers it
automatically; it must not duplicate its content.

### `docs/Project/`

Contains the project overview, architecture, requirements, contracts,
plans, roadmap, repository structure, and specification documents.

### `docs/SmokeTest.md`

Contains straightforward flow-based tests for the application.

Examples:

- application starts
- dashboard opens
- navigation works
- unauthorized page is hidden
- unauthorized action is hidden
- disabled feature section does not render
- enabled feature section renders
- mock telemetry appears
- alert appears
- HMI action follows the access rules
- responsive navigation works

Smoke tests should be written in plain language and should be easy for a
human or AI agent to follow.

## `src/app/`

Application-level setup.

Potential responsibilities:

- application providers
- global application initialization
- shared app configuration

Do not put feature-specific UI here.

## `src/components/`

Reusable UI components.

Examples:

- Button
- Card
- Badge
- Modal
- StatusIndicator
- DataTable
- ChartContainer
- LoadingState
- ErrorState

Components should remain reasonably generic.

## `src/config/`

Application configuration.

Examples:

- navigation configuration
- environment-derived configuration
- feature configuration
- application constants

Do not store secrets here.

## `src/data/`

Development and mock data.

Examples:

- mock telemetry
- mock users
- mock permissions
- mock feature flags
- mock alarms
- mock financial data

Mock data must remain clearly separated from production integration
code.

## `src/features/`

Feature-specific logic.

Expected feature areas may include:

```text
features/
├── dashboard/
├── power/
├── financial/
├── alerts/
├── hmi/
├── admin/
└── auth/
```

A feature may contain its own:

- components
- hooks
- utilities
- data transformations
- feature-specific services

Do not force every tiny component into a feature folder if it is
genuinely reusable.

## `src/hooks/`

Reusable React hooks.

Examples:

- access hooks
- connection hooks
- telemetry hooks
- responsive behavior hooks

Keep hooks focused.

## `src/layouts/`

Application layout components.

Examples:

- AppLayout
- AuthLayout
- AdminLayout

## `src/lib/`

Small third-party integrations or foundational libraries.

Examples may include:

- animation helpers
- chart setup
- utility-library wrappers

Do not turn this into a miscellaneous dumping ground.

## `src/pages/`

Route-level page components.

Potential pages:

```text
pages/
├── DashboardPage.jsx
├── PowerPage.jsx
├── FinancialPage.jsx
├── AlertsPage.jsx
├── HmiPage.jsx
├── AdminPage.jsx
└── NotFoundPage.jsx
```

Pages should compose feature components rather than contain large
amounts of reusable logic.

## `src/routes/`

Routing and route protection.

Responsibilities:

- route definitions
- protected routes
- page-access checks
- route-level access handling

## `src/services/`

External communication and application service boundaries.

Potential structure:

```text
services/
├── telemetry/
├── analytics/
├── commands/
├── auth/
└── integration/
```

The service layer must hide transport-specific implementation details
from UI components.

For example, components should request telemetry through an application
service rather than knowing MQTT, Modbus, HTTP, WebSocket, or another
transport directly.

## `src/styles/`

Global styles and design-system-level CSS.

Tailwind should handle most component styling.

Avoid creating large custom CSS files when utility classes or reusable
components are sufficient.

## `src/utils/`

Small pure utility functions.

Examples:

- formatting
- unit conversion
- date/time helpers
- validation
- access evaluation helpers when they are not React-specific

Keep utilities dependency-light.

## Naming

Use clear, consistent names.

React components:

```text
PascalCase.jsx
```

JavaScript modules:

```text
camelCase.js
```

Feature folders:

```text
lowercase/
```

Examples:

```text
SourceStatusCard.jsx
useTelemetry.js
formatEnergy.js
```

## Data Boundaries

The repository should maintain this conceptual separation:

```text
UI
 ↓
Hooks / Feature Logic
 ↓
Application Services
 ↓
Integration Adapter
 ↓
External System
```

Mock development should use the same boundary:

```text
UI
 ↓
Hooks / Feature Logic
 ↓
Application Services
 ↓
Mock Adapter
```

This allows the frontend to be developed without pretending the
production transport is already known.

## Access-Control Boundary

Access evaluation should be centralized.

Conceptually:

```text
User
 ↓
Role / Permissions
 ↓
Feature Flags
 ↓
Effective Access
 ↓
Routes / Navigation / Actions / Sections
```

Do not scatter independent permission checks throughout unrelated
components.

## Animation Boundary

Animation utilities/components should be reusable.

The application should not have unrelated animation implementations for
every screen.

Use:

- shared transition patterns
- shared processing states
- shared reduced-motion behavior
- custom ATS-specific power-flow visualization

## Environment Variables

Production configuration must use environment variables.

Never commit:

- passwords
- API secrets
- device credentials
- private keys
- authentication tokens

Frontend environment variables must be treated as public unless the
build system explicitly provides a secure server-side mechanism.

## Structure Growth Rule

The repository structure is a guide, not a reason to create empty
folders.

Create a folder when:

- the related code exists, or
- the architectural boundary is needed for an active implementation.

Avoid speculative architecture.

## Important

The exact integration structure may change after the existing Node-RED
system is fully inspected.

When that happens:

1. Update the relevant architecture/integration documentation.
2. Update this repository structure document if necessary.
3. Keep the change isolated.
4. Commit the documentation change separately when appropriate.
