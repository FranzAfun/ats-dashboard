# 09. Development Roadmap

## Purpose

This roadmap defines the implementation order for the ATS Dashboard.

The project must be built incrementally. Each phase should be completed
and validated before unrelated work begins.

## Phase 0: Documentation and Project Baseline

### Goals

-   Confirm project scope.
-   Confirm frontend stack.
-   Establish architecture and data-contract assumptions.
-   Establish AI agent working rules.
-   Establish smoke-test documentation.

### Required baseline documents

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
-   `docs/Agents/10_AGENT_INSTRUCTIONS.md`
-   `docs/Agents/CLAUDE.md`
-   `docs/SmokeTest.md`

## Phase 1: Existing-System and Integration Confirmation

### Goals

Understand the existing Node-RED/ATS system before implementing live
integration.

Tasks:

-   Inspect the existing ATS flow.
-   Confirm available telemetry.
-   Confirm source states.
-   Confirm temperature data.
-   Confirm tariff data.
-   Confirm financial/energy data.
-   Confirm alarm information.
-   Confirm ATS transition information.
-   Confirm available HMI commands.
-   Confirm how commands are sent.
-   Confirm authentication/security requirements.
-   Confirm the actual frontend integration transport.

### Rule

Do not invent missing MQTT topics, Modbus registers, HTTP endpoints,
WebSocket payloads, command formats, or authentication behavior.

Unknown integration details remain TBD until confirmed.

## Phase 2: Frontend Foundation

### Goals

Create the reusable application foundation.

Tasks:

-   React + Vite setup.
-   Tailwind CSS setup.
-   Routing.
-   Global styling and design tokens.
-   Responsive application shell.
-   Sidebar/navigation.
-   Header/top bar.
-   Main content area.
-   Basic loading/error states.
-   Responsive navigation behavior.
-   Initial animation utilities.

### Validation

-   Application starts.
-   Production build succeeds.
-   Navigation works.
-   Layout works on desktop and small screens.
-   No console errors caused by the application foundation.

## Phase 3: Access and Mock Data Foundation

### Goals

Establish access control concepts and development data before building
feature-heavy pages.

Tasks:

-   Mock users.
-   Mock roles.
-   Mock permissions.
-   Mock feature flags.
-   Central access helpers.
-   Protected routes.
-   Access-aware navigation.
-   Action-level access checks.
-   Feature-dependent dashboard sections.
-   Mock telemetry adapter.
-   Mock analytics adapter.
-   Mock command adapter.

### Important rule

The mock adapters must use the same application-level structures
expected by the future live integration.

## Phase 4: Motion and Interaction Foundation

### Goals

Create a consistent motion system.

Tasks:

-   Install and configure `thinking-orbs`.
-   Establish meaningful processing/loading states.
-   Add appropriate transition patterns.
-   Establish reduced-motion handling.
-   Establish animation timing conventions.
-   Establish reusable motion utilities/components.
-   Keep continuous animation limited to areas where it communicates
    system state.

### ATS-specific motion

-   Custom animated power-flow visualization.
-   Source-state transitions.
-   Connection/processing states.
-   Alert transitions.
-   HMI feedback states.

## Phase 5: Dashboard

### Goals

Build the standard dashboard page.

Core areas:

-   Live tariff.
-   Temperature monitoring.
-   Source status.
-   ATS status.
-   HMI remote-control entry points where permitted.
-   Animated power-flow diagram.
-   Feature-dependent telemetry sections.
-   Feature-dependent financial sections.
-   Condition-awareness sections when enabled.

### Rules

-   Dashboard access is standard for users who have dashboard access.
-   Individual dashboard sections are feature-dependent.
-   Restricted sections must not render when their feature is
    unavailable.

## Phase 6: Power Parameters

Build:

-   Load telemetry.
-   Generator telemetry.
-   Grid telemetry.
-   Solar telemetry.
-   Voltage/current/power/energy/frequency/power-factor displays where
    available.
-   Source status.
-   Appropriate charts and trends.

Use mock data until live integration is confirmed.

## Phase 7: Condition Awareness

Build:

-   Live alarm banner.
-   Visual alerts.
-   Alert history where supported.
-   Connection/status indicators.
-   Clear severity presentation.
-   Accessible alert states.

## Phase 8: Financial Analytics

Build:

-   Source usage percentage.
-   ATS transition metrics.
-   Live tariff information.
-   Energy consumption.
-   Cost trends.
-   Daily/monthly/yearly views.
-   Energy-source costs.
-   Power-factor loss/penalty information where supported.
-   Data export.

Financial data must remain feature-dependent.

## Phase 9: HMI Controls

Build:

-   Source selection/change.
-   Manual cost/day configuration.
-   Command confirmation.
-   Command processing state.
-   Success/failure feedback.
-   Current-source state synchronization.

Every HMI action must pass through the centralized access model.

Do not connect HMI controls to real devices until the command contract
is confirmed.

## Phase 10: Admin Module

Build:

-   User management.
-   Role management.
-   Permission management.
-   Feature management.
-   User-specific feature access.
-   Effective-access inspection where appropriate.
-   Admin-only controls.

Admin functionality must be protected by appropriate permissions.

## Phase 11: Live Integration

Only after the integration contract is confirmed:

-   Implement the production transport adapter.
-   Connect telemetry.
-   Connect alarms.
-   Connect analytics data.
-   Connect HMI commands.
-   Implement connection/reconnection behavior.
-   Handle stale data.
-   Handle command failures.
-   Validate data freshness.
-   Protect credentials and secrets.

The React application must continue to communicate through
service/adaptor boundaries rather than directly with physical devices.

## Phase 12: Testing and Hardening

Validate:

### Functional

-   Navigation.
-   Page access.
-   Action access.
-   Feature access.
-   Dashboard behavior.
-   Telemetry rendering.
-   Alerts.
-   Financial calculations/display.
-   HMI commands.
-   Admin controls.

### Responsive

Test:

-   Desktop.
-   Laptop.
-   Tablet.
-   Small mobile widths.

### Accessibility

Test:

-   Keyboard navigation.
-   Focus states.
-   Readable status information.
-   Reduced motion.
-   Appropriate labels.
-   Alert announcements where needed.

### Performance

Check:

-   Unnecessary rerenders.
-   Excessive animation.
-   Large data rendering.
-   Chart performance.
-   Connection update frequency.

### Integration

Validate:

-   Telemetry freshness.
-   Missing values.
-   Connection loss.
-   Reconnection.
-   Invalid commands.
-   Command failures.
-   Stale data.

## Phase 13: Deployment

Only after production integration and hardening are complete:

-   Configure production environment variables.
-   Confirm build configuration.
-   Confirm deployment target.
-   Configure production API/transport endpoints.
-   Confirm HTTPS/security requirements.
-   Confirm production authentication.
-   Confirm monitoring/logging approach.
-   Run final smoke tests.

## Development Order Rule

The preferred implementation sequence is:

1.  Foundation.
2.  Access model.
3.  Mock data.
4.  Motion system.
5.  Dashboard.
6.  Power.
7.  Alerts.
8.  Financial.
9.  HMI.
10. Admin.
11. Live integration.
12. Hardening.
13. Deployment.

This order may change only when a documented dependency requires it.

## Commit Strategy

Each meaningful implementation step should be a small logical commit.

Examples:

-   `chore: scaffold ats dashboard`
-   `chore: configure tailwind`
-   `feat: add application shell`
-   `feat: add access model`
-   `feat: add mock telemetry adapter`
-   `feat: add dashboard source status`
-   `feat: add power telemetry cards`
-   `feat: add alert banner`
-   `feat: add financial cost trend`
-   `feat: add hmi source control`
-   `feat: add admin feature management`

Do not combine unrelated phases into one commit.

## Milestone Rule

A milestone is complete when:

-   The feature works.
-   Relevant validation passes.
-   Responsive behavior is checked.
-   Access behavior is checked when relevant.
-   Documentation is updated when the implementation changes a project
    decision.
-   The Git diff contains only the intended work.
-   The change is committed separately.

## Implementation Status (Frontend)

  Phase                                   Status
  --------------------------------------- ------------------------------------------
  0 Documentation and baseline            Done
  1 Existing-system confirmation          Open — requires the ATS/Node-RED owner
  2 Frontend foundation                   Done
  3 Access and mock data foundation       Done (mock access backend)
  4 Motion and interaction foundation     Done (SPEC.md §25)
  5 Dashboard                             Done with mock data
  6 Power parameters                      Done with mock data; live load-power
                                          trend from received samples (stored
                                          historical trends wait on the TBD
                                          historical data source)
  7 Condition awareness                   Done with mock data
  8 Financial analytics                   Done with mock/demo calculations
  9 HMI controls                          Done against the mock command adapter
  10 Admin module                         Done against the mock access backend
                                          (no user creation/audit: auth TBD)
  11 Live integration                     Blocked — transport, payloads, commands
                                          and authentication are not confirmed
  12 Testing and hardening                Done for the frontend: unit tests,
                                          smoke tests, responsive/a11y checks
  13 Deployment                           Prepared (`netlify.toml`); production
                                          deployment waits on Phase 11

Everything that depends on the real ATS/Node-RED system is isolated
behind `src/services/integration/` and marked TBD in the documentation.
