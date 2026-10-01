# 05 Frontend Architecture

## 1. Purpose

This document defines the architecture of the custom ATS web application
frontend.

The frontend will be built as a modern React application and will
consume the application-level data contract defined in
`04_DATA_CONTRACT.md`.

The frontend is a presentation and interaction layer. It is not
responsible for directly controlling PLCs, Modbus devices, or PZEM
sensors.

------------------------------------------------------------------------

# 2. Frontend Stack

The application shall use:

-   React
-   Vite
-   JavaScript
-   Tailwind CSS

## Not Used

-   Bootstrap
-   TypeScript
-   jQuery
-   Server-rendered frontend frameworks unless specifically required
    later
-   Hardcoded production telemetry

------------------------------------------------------------------------

# 3. Architectural Principle

The frontend should follow this flow:

``` text
Authentication / Access State
            ↓
React Pages
            ↓
Reusable Components
            ↓
Application State
            ↓
Services / Integration Layer
            ↓
Application Data Contract
            ↓
Confirmed Backend / Node-RED Interface
```

The UI must not depend directly on raw MQTT messages, Modbus registers,
or device-specific payloads.

------------------------------------------------------------------------

# 4. Application Layers

## 4.1 Pages

Pages represent major user-facing screens.

Examples:

-   Dashboard
-   Power
-   Financial Analytics
-   Alerts
-   HMI Control
-   Settings
-   Administration

Pages should compose components rather than contain large amounts of
business logic.

------------------------------------------------------------------------

## 4.2 Components

Components provide reusable UI elements.

Examples:

``` text
MetricCard
SourceStatusCard
TelemetryCard
TariffCard
TemperatureCard
PowerFlowDiagram
AlarmBanner
AlertList
CostChart
EnergyChart
UsageChart
TransitionMetrics
HmiControlPanel
DataTable
ConnectionStatus
LoadingState
ErrorState
```

Components should receive data through props or application state.

Access-sensitive components should render according to the user's
effective access.

------------------------------------------------------------------------

## 4.3 Services

Services handle communication with external systems.

Example structure:

``` text
services/
├── telemetry.service.js
├── control.service.js
├── analytics.service.js
├── alerts.service.js
├── auth.service.js
├── access.service.js
└── export.service.js
```

Services should hide integration details from UI components.

------------------------------------------------------------------------

# 5. Proposed Project Structure

``` text
src/
├── app/
│   ├── App.jsx
│   ├── routes.jsx
│   └── providers.jsx
│
├── assets/
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── power/
│   ├── financial/
│   ├── alerts/
│   ├── hmi/
│   └── admin/
│
├── data/
│   ├── mock/
│   └── constants/
│
├── hooks/
│   ├── useAuth.js
│   ├── useAccess.js
│   └── useFeature.js
│
├── layouts/
│   ├── AppLayout.jsx
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── Dashboard/
│   ├── Power/
│   ├── Financial/
│   ├── Alerts/
│   ├── Hmi/
│   ├── Settings/
│   └── Admin/
│
├── services/
│
├── store/
│
├── utils/
│
├── config/
│
├── styles/
│
└── main.jsx
```

This structure may be adjusted during implementation if the actual
project size or integration requirements justify it.

------------------------------------------------------------------------

# 6. Routing

The application should use client-side routing.

Proposed routes:

``` text
/dashboard
/power
/financial
/alerts
/hmi
/settings
/admin
```

Routes shall be protected according to the user's effective page access.

A hidden navigation item is not sufficient protection. Unauthorized
direct route access must also be rejected.

------------------------------------------------------------------------

# 7. Dashboard Page

The Dashboard is the main operational screen.

It should provide a quick view of:

-   Active source
-   Source status
-   Live tariff
-   Temperature
-   Key electrical metrics
-   Power-flow visualization
-   Active alarms
-   Connection status
-   HMI access where permitted

The Dashboard itself is a standard/core application section, but its
internal sections and data shall respect feature access.

Example:

``` text
Dashboard
├── Core information
├── Power Monitoring      → feature-dependent
├── Financial Analytics   → feature-dependent
├── Alerts                → feature-dependent
└── HMI                   → feature-dependent
```

If a user lacks access to a feature, the corresponding Dashboard section
must not render.

------------------------------------------------------------------------

# 8. Power Page

The Power page should provide detailed electrical telemetry.

It may contain:

-   Load telemetry
-   Solar telemetry
-   Grid telemetry
-   Generator telemetry
-   Voltage
-   Current
-   Power
-   Energy
-   Frequency
-   Power factor

Only fields available from the actual data contract should be displayed
as live values.

Page visibility and individual actions shall follow access rules.

------------------------------------------------------------------------

# 9. Financial Page

The Financial page should contain:

-   Source usage percentage
-   Energy consumption
-   Source costs
-   Tariff information
-   Cost trends
-   Power factor financial impact
-   ATS transition metrics where relevant
-   Data export

Charts should receive structured data rather than constructing data
internally from hardcoded values.

If Financial Analytics is disabled for a user, the page, navigation
item, and Dashboard financial section shall not be displayed.

------------------------------------------------------------------------

# 10. Alerts Page

The Alerts page should provide:

-   Active alarms
-   Historical alerts where available
-   Severity
-   Timestamp
-   Alert message
-   Current status

The page must distinguish between active and cleared conditions if the
backend provides that information.

Access to alert features shall be evaluated through the application's
access model.

------------------------------------------------------------------------

# 11. HMI Page

The HMI page is the control interface.

Expected controls include:

-   Change source/input
-   Change input cost/day

Controls must provide:

1.  Current value
2.  Available options
3.  Validation
4.  Confirmation where required
5.  Command state
6.  Error feedback

A user may have access to the HMI page without access to every HMI
action.

Example:

``` text
HMI
├── View source status       → visible
├── View telemetry           → visible
├── Change source            → permission-dependent
└── Change cost/day          → permission-dependent
```

Unauthorized controls should not be rendered.

The HMI interface must not bypass the approved ATS control path.

------------------------------------------------------------------------

# 12. Settings Page

The Settings page can contain application-level settings.

Potential areas:

-   Display preferences
-   Unit preferences
-   Account information
-   Connection information where appropriate
-   Application configuration

Device-level settings should not be exposed unless explicitly supported
by the backend/control architecture.

------------------------------------------------------------------------

# 13. Administration Page

The Administration area is restricted to authorized administrators.

Potential sections:

``` text
Administration
├── Users
├── Roles / Permissions
├── Feature Flags
└── Access Review
```

Feature flags that control user-facing capabilities shall be managed
through this module.

The frontend must not contain hardcoded per-user feature decisions.

------------------------------------------------------------------------

# 14. State Management

The application should separate authentication/access state,
server/system state, and local UI state.

### Authentication / Access State

Examples:

-   Current user
-   Role
-   Permissions
-   Enabled features
-   Page access
-   Action access

### System State

Examples:

-   Telemetry
-   Active source
-   Tariff
-   Alarms
-   ATS status
-   Financial data
-   Connection state

### Local UI State

Examples:

-   Selected chart period
-   Open modal
-   Sidebar state
-   Selected table row
-   Filter state

The state-management solution should be chosen based on actual
application complexity rather than adding a large state library
unnecessarily.

------------------------------------------------------------------------

# 15. Access Evaluation

The frontend should have a central access-evaluation mechanism.

Conceptually:

``` js
canAccess("financial")
canPerform("hmi.changeSource")
hasFeature("financialAnalytics")
```

The exact implementation will be defined in
`06_AUTH_AND_FEATURE_FLAGS.md`.

Access checks should not be duplicated as unrelated logic throughout
components.

------------------------------------------------------------------------

# 16. Navigation Visibility

Navigation should be generated from access-aware configuration where
practical.

Example:

``` js
const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    feature: null
  },
  {
    label: "Financial",
    path: "/financial",
    feature: "financialAnalytics"
  },
  {
    label: "HMI",
    path: "/hmi",
    feature: "hmi"
  }
];
```

The navigation layer should only render items the current user can
access.

------------------------------------------------------------------------

# 17. Dashboard Feature Visibility

Dashboard sections should use the same access system as navigation.

Example:

``` js
const dashboardSections = [
  {
    id: "power",
    feature: "powerMonitoring"
  },
  {
    id: "financial",
    feature: "financialAnalytics"
  },
  {
    id: "alerts",
    feature: "alerts"
  }
];
```

The Dashboard must not show restricted feature data merely because the
Dashboard itself is accessible.

------------------------------------------------------------------------

# 18. Action / Button Visibility

Action controls should be permission-aware.

Example:

``` js
{canPerform("hmi.changeSource") && (
  <ChangeSourceButton />
)}
```

The same principle applies to:

-   Export buttons
-   User-management actions
-   Feature-management actions
-   HMI controls
-   Configuration actions

This controls UI visibility. The actual operation must still be
authorized by the appropriate backend/control layer.

------------------------------------------------------------------------

# 19. Data Fetching

Data fetching must occur through services/hooks rather than being
scattered across components.

Example:

``` text
Page
  ↓
Custom Hook
  ↓
Service
  ↓
Integration Adapter
  ↓
Approved Data Source
```

Example:

``` js
const { telemetry, loading, error } = useTelemetry();
```

The exact data-fetching library is not fixed yet.

------------------------------------------------------------------------

# 20. Real-Time Data

The application requires live operational information.

The exact real-time transport is not yet confirmed.

Therefore, the frontend architecture shall support a transport
abstraction.

Example:

``` js
const telemetryTransport = {
  connect() {},
  disconnect() {},
  subscribe() {},
  unsubscribe() {}
};
```

The implementation can later use the confirmed transport without
changing the dashboard components.

Do not build the application around `/ws/telemetry` merely because the
existing Node-RED flow contains that endpoint.

------------------------------------------------------------------------

# 21. Mock Data

Mock data is required for frontend development before live integration
is complete.

Mock data should live separately:

``` text
data/
└── mock/
    ├── telemetry.mock.js
    ├── financial.mock.js
    ├── alerts.mock.js
    ├── access.mock.js
    └── hmi.mock.js
```

Mock objects must follow the same data structures used by live data.

The mock access model should also support different users so restricted
navigation, dashboard sections, and actions can be tested.

------------------------------------------------------------------------

# 22. Data Structures

Shared application data structures should be kept in a dedicated
location such as:

``` text
src/
└── data/
    └── schemas/
```

Because the project uses JavaScript, the application should use clear
object shapes, JSDoc where useful, and validation at integration
boundaries rather than introducing TypeScript.

Example:

``` js
/**
 * @typedef {Object} UserAccess
 * @property {string[]} permissions
 * @property {string[]} features
 */
```

The final structures shall follow the finalized data contract and access
model.

------------------------------------------------------------------------

# 23. Configuration

Application configuration should be separated from component code.

Example:

``` text
src/
└── config/
    ├── app.config.js
    ├── navigation.config.js
    └── chart.config.js
```

Do not hardcode:

-   API URLs
-   Environment-specific endpoints
-   Secrets
-   Production credentials
-   Device addresses
-   User-specific feature access

Environment-specific values should use Vite environment variables where
appropriate.

------------------------------------------------------------------------

# 24. Environment Configuration

Frontend environments should be separated.

Expected environments:

``` text
development
production
```

Potential configuration:

``` text
VITE_API_BASE_URL
VITE_TELEMETRY_ENDPOINT
```

Only values that are genuinely required by the final integration should
be introduced.

Do not create environment variables for every small configuration value
simply for the sake of having environment variables.

------------------------------------------------------------------------

# 25. Styling Architecture

Tailwind CSS will be the primary styling system.

The project should establish a consistent design system for:

-   Colors
-   Typography
-   Spacing
-   Border radius
-   Shadows
-   Cards
-   Buttons
-   Status states
-   Charts
-   Alerts

Repeated visual patterns should use reusable components.

Do not scatter arbitrary styling values throughout the application when
a shared design token is appropriate.

------------------------------------------------------------------------

# 26. Responsive Design

The interface should support the screen sizes required for the project.

The primary target is an operational dashboard environment.

The UI should remain usable on:

-   Desktop
-   Laptop
-   Tablet where practical

Responsive behavior should be designed intentionally rather than relying
on accidental browser wrapping.

------------------------------------------------------------------------

# 27. Loading States

Every major data-dependent section should have an appropriate loading
state.

Examples:

``` text
Loading telemetry...
Loading analytics...
Loading alerts...
```

------------------------------------------------------------------------

# 28. Error States

The application must distinguish between:

-   Request failure
-   Connection failure
-   Invalid data
-   Missing data
-   Stale data
-   Command failure
-   Authorization failure

An authorization failure should not expose restricted data.

------------------------------------------------------------------------

# 29. Connection Status

The application should provide a visible system connection state.

Proposed states:

``` text
Connected
Connecting
Disconnected
Stale
Error
```

The exact detection mechanism depends on the final integration
architecture.

------------------------------------------------------------------------

# 30. Charts

Charts should be implemented as reusable components.

Example:

``` text
charts/
├── CostTrendChart
├── EnergyTrendChart
├── SourceUsageChart
└── PowerFactorChart
```

Charts should receive data through props or application state.

They should not contain hardcoded production datasets.

------------------------------------------------------------------------

# 31. Power Flow Visualization

The power-flow diagram should be a reusable dashboard component.

It should receive source state as data.

Example:

``` js
const powerFlowState = {
  activeSource: "grid",
  solarAvailable: true,
  gridAvailable: true,
  generatorAvailable: true
};
```

The visual state should update from application data.

The animation should not permanently indicate that a particular source
is active.

------------------------------------------------------------------------

# 32. HMI Interaction Pattern

HMI controls should use a controlled command flow:

``` text
User Action
    ↓
Access Check
    ↓
Validation
    ↓
Confirmation (if required)
    ↓
Command Service
    ↓
Approved Integration Layer
    ↓
Node-RED / ATS
    ↓
Command Result
    ↓
UI Feedback
```

The UI must not assume that sending a command means the ATS applied it.

------------------------------------------------------------------------

# 33. Security Boundaries

The frontend must never contain:

-   Device passwords
-   MQTT credentials
-   Private API keys
-   Server secrets
-   Database credentials

Public frontend configuration is not a security boundary.

Hiding a navigation item or button is also not sufficient security.

Sensitive data access and control operations must be protected by the
appropriate backend/control layer.

------------------------------------------------------------------------

# 34. Performance Principles

The frontend should:

-   Avoid unnecessary re-renders
-   Avoid requesting the same data repeatedly
-   Use appropriate polling/subscription behavior
-   Keep chart rendering efficient
-   Lazy-load large pages where useful
-   Avoid unnecessary dependencies

------------------------------------------------------------------------

# 35. Accessibility

The interface should provide:

-   Clear labels
-   Keyboard-accessible controls
-   Adequate contrast
-   Meaningful status text
-   Accessible form controls
-   Non-color-only status communication where practical

Critical alarms should not rely on color alone.

------------------------------------------------------------------------

# 36. Testing Architecture

The frontend should eventually contain tests for:

### Components

-   Rendering
-   States
-   User interaction
-   Access-controlled rendering

### Services

-   Successful responses
-   Failed responses
-   Invalid responses
-   Authorization failures

### HMI

-   Permission checks
-   Validation
-   Command submission
-   Command failure
-   Confirmation behavior

### Access

-   Navigation visibility
-   Dashboard section visibility
-   Action/button visibility
-   Different user access configurations

### Data

-   Transformation
-   Missing values
-   Invalid values

The testing stack can be finalized during project setup.

------------------------------------------------------------------------

# 37. Dependency Principle

Only add a dependency when it solves a real project requirement.

Potential libraries for routing, charts, state management, data
fetching, icons, and testing should be selected during implementation
based on the finalized requirements.

The project should not accumulate packages simply because they are
popular.

------------------------------------------------------------------------

# 38. Ownership Boundary

### Existing System / Cousin

Responsible for:

-   ATS control logic
-   Node-RED flows
-   Device communication
-   Modbus integration
-   PZEM/MQTT integration
-   Existing source logic
-   Existing system calculations where retained

### Custom Application

Responsible for:

-   User interface
-   Visualization
-   Analytics presentation
-   HMI interface
-   User interactions
-   Data export interface
-   Frontend validation
-   Connection and error presentation
-   Access-aware navigation and UI rendering

### Shared Responsibility

Requires an agreed contract:

-   Authentication
-   User identity
-   Roles
-   Permissions
-   Feature availability
-   Telemetry interface
-   Command interface
-   Alarm interface
-   Historical data
-   Financial data

------------------------------------------------------------------------

# 39. Frontend Development Rule

Build the frontend against the application contract, not against
assumptions about the physical devices.

This means:

``` text
Do not:
React → Modbus
React → PZEM
React → Raw MQTT

Prefer:
React → Access / Application Service → Confirmed Integration
```

------------------------------------------------------------------------

# 40. Architecture Completion Criteria

The frontend architecture is considered ready for implementation when:

-   Pages are defined
-   Component boundaries are defined
-   Data contract exists
-   Integration boundary exists
-   Authentication/access boundary is defined
-   Mock data follows the contract
-   Mock access configurations can test different users
-   Environment strategy is defined
-   HMI interaction flow is defined
-   Security boundary is understood
-   No production values need to be hardcoded
-   Navigation, dashboard sections, and actions can respond to effective
    access

The next document will define the detailed authentication, role,
permission, and feature-flag model.
