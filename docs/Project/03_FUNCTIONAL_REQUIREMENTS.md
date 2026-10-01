# 03 Functional Requirements

## 1. Purpose

This document defines what the custom ATS web application must do.

The requirements are based on the confirmed project scope and existing
Node-RED functionality. Requirements that depend on an integration
detail that has not yet been confirmed are marked accordingly.

------------------------------------------------------------------------

## 2. Application Goal

The application shall provide a custom web interface for monitoring,
analysing, and interacting with the existing Automatic Transfer System.

The application shall consume system data through the confirmed
integration layer and shall not replace the existing ATS control logic
unnecessarily.

------------------------------------------------------------------------

# 3. Functional Areas

The application is divided into:

1.  Dashboard / Live Monitoring
2.  Power Parameters
3.  Financial Analytics
4.  Condition Awareness
5.  HMI Remote Control
6.  Administration
7.  User Access and Feature Management

------------------------------------------------------------------------

# 4. Dashboard / Live Monitoring

## FR-HOME-001: Dashboard Availability

The Dashboard shall be a standard/core application section.

Its base content shall be available according to the application's
baseline access model.

Individual sections within the Dashboard may be controlled by feature
access.

------------------------------------------------------------------------

## FR-HOME-002: Feature-Dependent Dashboard Sections

Dashboard sections shall respect the user's effective feature access.

If a user does not have access to a feature, information belonging
exclusively to that feature shall not be displayed on the Dashboard.

Example:

``` text
User has Power access
User does not have Financial access

Dashboard:
✓ Power section
✗ Financial section
```

Granting access to Financial Analytics shall make the appropriate
financial dashboard section available.

The Dashboard must not become a bypass around page-level feature
restrictions.

------------------------------------------------------------------------

## FR-HOME-003: Live Tariff

The application shall display the current tariff associated with the
active power source.

The displayed tariff shall come from system data and must not be
hardcoded.

------------------------------------------------------------------------

## FR-HOME-004: Temperature Monitoring

The application shall display temperature information received from the
existing system.

Temperature data is currently associated with the Modbus TCP layer.

The exact temperature payload and unit must be confirmed during
integration.

------------------------------------------------------------------------

## FR-HOME-005: Source Status

The application shall clearly indicate the current status of:

-   Solar
-   Grid
-   Generator
-   ATS/source switching state where available

Status indicators shall reflect live system data.

------------------------------------------------------------------------

## FR-HOME-006: Animated Power Flow

The application shall provide an animated visual representation of power
movement through the system.

The animation state must be derived from the active source/status data
rather than being permanently hardcoded.

------------------------------------------------------------------------

# 5. Power Parameters

## FR-POWER-001: Load Telemetry

The application shall display available load electrical parameters.

The exact parameter list will depend on the telemetry supplied by the
existing system.

Load is not a power source. Load telemetry is represented separately
from source telemetry, as defined in `04_DATA_CONTRACT.md`.

## FR-POWER-002: Generator Telemetry

The application shall display available generator telemetry.

## FR-POWER-003: Grid Telemetry

The application shall display available grid telemetry.

## FR-POWER-004: Solar Telemetry

The application shall display available solar telemetry.

## FR-POWER-005: Power Factor

The application shall display power factor information where provided by
the existing system.

Power factor-related financial effects shall also be represented in the
financial analytics area where the required data exists.

------------------------------------------------------------------------

# 6. Financial Analytics

## FR-FIN-001: Source Usage Percentage

The application shall display the percentage of system runtime/usage
attributed to each source.

The existing Node-RED logic calculates source runtime and usage
percentages from source/contactor states.

Therefore, the frontend should consume the calculated values rather than
duplicate the calculation unless explicitly required.

## FR-FIN-002: ATS Transition Metrics

The application shall display ATS transition information.

Potential information includes:

-   Number of transitions
-   Transition timing
-   Dead time
-   Switch time
-   Event information
-   Alarm state associated with transitions

## FR-FIN-003: Live Tariff Information

The application shall display:

-   Active source
-   Active tariff
-   Energy consumption
-   Relevant current cost information

## FR-FIN-004: Cost Trends

The application shall provide cost trend visualizations for:

-   Daily
-   Monthly
-   Yearly

## FR-FIN-005: Energy Source Costs

The application shall display cost information for:

-   Solar
-   Grid
-   Generator

Values shall be data-driven.

## FR-FIN-006: Power Factor Losses

The application shall display available financial impact associated with
power factor losses.

## FR-FIN-007: Data Export

The application shall provide a mechanism for exporting available
analytics/history data.

The export format and exact data range are to be finalized during
implementation planning.

Interim implementation: a client-side CSV export of the cost trend and
source energy/cost for the selected period, available only with the
`financial.export` permission and the `financialAnalytics` and
`dataExport` features. Mock exports are prefixed `MOCK-` and labelled
inside the file. The production format and range remain TBD.

------------------------------------------------------------------------

# 7. Condition Awareness

## FR-ALERT-001: Live Alarm Banner

The application shall display active alarms prominently.

The alarm state shall be derived from system data.

## FR-ALERT-002: Visual Alerts

The application shall provide visual indicators for relevant abnormal
conditions.

The application shall not invent alarm conditions that are not defined
by the system.

------------------------------------------------------------------------

# 8. HMI Remote Control

HMI control is a high-impact feature because it can affect the ATS
operating state.

## FR-HMI-001: Change Source/Input

An authorized user shall be able to request a change to the selected
source/input.

Only users with the required feature and action access shall see the
control.

The command shall pass through the approved control path.

## FR-HMI-002: Change Input Cost/Day

An authorized user shall be able to manually change the configured input
cost/day.

Only users with the required feature and action access shall see the
control.

The value shall be validated before submission.

## FR-HMI-003: Command Feedback

After sending a control command, the application should communicate the
command state to the user.

Possible states include:

-   Pending
-   Accepted
-   Rejected
-   Failed
-   Applied

## FR-HMI-004: Control Safety

The application shall not present a control as successfully applied
unless the system provides confirmation.

A failed or rejected command shall be clearly distinguishable from a
successful command.

------------------------------------------------------------------------

# 9. Users, Roles, Permissions, and Feature Access

## FR-ACCESS-001: User Accounts

The application shall support individual user accounts.

Each user shall have an effective access configuration.

## FR-ACCESS-002: Roles

Users shall be associated with roles.

The exact role list will be finalized in `06_AUTH_AND_FEATURE_FLAGS.md`.

## FR-ACCESS-003: Page Access

A user without access to a page/module shall not see its navigation
item.

Direct URL protection shall also be implemented so hidden navigation is
not treated as the security mechanism.

## FR-ACCESS-004: Action Access

A user may access a page without having access to every action within
it.

Actions the user cannot perform shall not be displayed.

Examples:

-   Change source
-   Change input cost/day
-   Export data
-   Manage users
-   Manage features

## FR-ACCESS-005: Feature Flags

Feature flags shall control whether defined application capabilities are
available.

Feature flags may affect:

-   Navigation
-   Pages
-   Dashboard sections
-   Actions
-   Controls
-   Analytics
-   Data visibility

## FR-ACCESS-006: Administrator Feature Management

Feature flags that control user-facing capabilities shall be managed
through the administrative module.

Only authorized administrators shall be able to toggle feature
availability for users.

Feature access shall not be manually edited inside React components.

## FR-ACCESS-007: Dashboard Data Access

Dashboard content shall respect feature access.

If a user does not have access to a feature, data belonging to that
feature shall not be rendered on the Dashboard.

This applies even when the Dashboard itself is available to the user.

## FR-ACCESS-008: Effective Access

The application shall determine what a user can see and do from the
user's effective access configuration.

The frontend shall use this access information to control navigation and
UI visibility.

Sensitive backend/control operations must also enforce authorization
independently.

------------------------------------------------------------------------

# 10. Administration

## FR-ADMIN-001: Admin Module

The application shall provide an administrative module for authorized
administrators.

## FR-ADMIN-002: User Management

Authorized administrators shall be able to manage users as permitted by
the final authorization model.

## FR-ADMIN-003: Feature Management

Authorized administrators shall be able to view and toggle supported
feature flags for users or applicable access groups.

## FR-ADMIN-004: Permission Management

Authorized administrators shall be able to manage supported permissions
according to the final role/permission model.

## FR-ADMIN-005: Access Visibility

The administration interface shall clearly show which features and
permissions are available to a user.

------------------------------------------------------------------------

# 11. Data Requirements

## FR-DATA-001: No Production Hardcoding

Production telemetry, tariffs, source status, costs, temperatures,
alarms, and other live values shall not be hardcoded into React
components.

## FR-DATA-002: Mock Data Separation

Demo data may be used during frontend development.

Mock data must be isolated from production services.

## FR-DATA-003: Structured Data

The frontend shall consume structured application data according to
`04_DATA_CONTRACT.md`.

------------------------------------------------------------------------

# 12. UI Requirements

## FR-UI-001: Frontend Technology

The application shall use:

-   React
-   Vite
-   JavaScript
-   Tailwind CSS

Bootstrap and TypeScript shall not be introduced into this project.

## FR-UI-002: Reusable Components

Repeated UI patterns shall be implemented as reusable components.

## FR-UI-003: Configuration Over Hardcoding

Values such as source names, units, chart configuration, display labels,
and appropriate thresholds should be driven through configuration or
structured data where practical.

## FR-UI-004: Responsive Interface

The interface shall support:

-   Desktop
-   Laptop
-   Tablet
-   Small mobile screens

Small mobile screens are a core requirement.

------------------------------------------------------------------------

# 13. Error and Connection States

The application shall account for system communication problems.

Required states include:

-   Connecting
-   Connected
-   Disconnected
-   Stale data
-   Error
-   Command failure

The UI must not display old telemetry as though it were current.

------------------------------------------------------------------------

# 14. Historical Data

Historical information is required for financial trends and analytics.

The exact historical storage mechanism is not yet confirmed.

The implementation must therefore avoid assuming a specific database
until the integration and storage design is finalized.

------------------------------------------------------------------------

# 15. Requirements That Are Not Yet Fully Defined

The following requirements cannot be finalized from the currently
confirmed information:

-   Exact telemetry fields
-   Exact telemetry update frequency
-   Exact command payloads
-   Authentication mechanism
-   Exact roles
-   Exact permission names
-   Exact feature-flag list
-   Whether feature flags apply to users individually, groups, roles, or
    a combination
-   Historical storage
-   Export format
-   Alarm definitions
-   Threshold definitions
-   Exact financial calculation rules
-   Exact MQTT topics/payloads
-   Exact frontend integration mechanism

These items must be resolved before the affected production features are
considered complete.

------------------------------------------------------------------------

# 16. Requirement Priority

### Core

-   Dashboard
-   Live source status
-   Live telemetry
-   Temperature
-   Tariff
-   Power parameters
-   Source usage
-   ATS transition information
-   Alerts
-   User access control

### Important

-   Cost trends
-   Energy source costs
-   Power factor financial impact
-   Data export
-   HMI source control
-   HMI cost/day control
-   Administrative feature management

### Dependent on Final Integration

-   Historical analytics
-   Advanced alert rules
-   Command confirmation
-   Authentication/authorization implementation
-   Production exports

Priority describes implementation dependency, not a product ranking.

------------------------------------------------------------------------

# 17. Acceptance Principle

A feature is not considered complete merely because its UI exists.

A functional feature must:

1.  Display or submit the correct structured data.
2.  Use the approved integration path.
3.  Handle loading and error states.
4.  Avoid production hardcoding.
5.  Behave correctly when data is unavailable.
6.  Clearly distinguish mock data from live data.
7.  Respect the existing ATS control architecture.
8.  Respect the user's effective access.
9.  Hide unauthorized navigation and actions.
10. Prevent unauthorized backend/control operations.

The next document will define the detailed authentication, role,
permission, and feature-flag model.
