# ATS Dashboard Smoke Tests

## Purpose

This document contains straightforward flow tests for verifying that the
ATS Dashboard works from a user's perspective.

These are smoke tests, not detailed unit tests.

Keep each test simple, focused, and easy to follow manually.

## Test Environment

Use the development application unless a specific environment is stated.

Expected development command:

``` bash
npm run dev
```

Use mock data until live integration is confirmed.

## Mock Users

In development the application uses the mock adapter. A "Mock data"
badge is always visible, and the signed-in user is chosen with the
"Mock user" selector at the bottom of the sidebar (inside the navigation
drawer on smaller screens).

  Mock user                    Use for
  ---------------------------- ------------------------------------------
  Mock Administrator           Admin flows (ST-019)
  Mock Operator                HMI flows (ST-012)
  Mock Viewer                  Page restriction (ST-004: no HMI, no Admin)
  Mock HMI Observer            Action restriction (ST-005, ST-013)
  Mock Viewer (no Financial)   Feature flag off (ST-006)
  Mock Analyst                 Export action
  Mock Disabled User           Disabled account (ST-025)

The selection is remembered in the browser. Admin changes to mock users
and feature flags last until the page is reloaded.

## Mock Scenarios

The "Mock scenario" selector (below the mock user selector) changes the
simulated system state:

  Scenario               Use for
  ---------------------- ----------------------------------------------
  Normal operation       Default state
  Active alarms          Alarm banner and alerts (ST-011)
  Stale telemetry        Stale data indication (ST-027)
  Disconnected           Connection loss (ST-027)
  Integration error      Error states (ST-015)
  Missing / empty data   Missing values and empty states (ST-008)
  Commands rejected      HMI rejection feedback
  Commands fail          HMI failure feedback

------------------------------------------------------------------------

## ST-001: Application Starts

### Steps

1.  Start the application.
2.  Open the local development URL.
3.  Wait for the application to load.

### Expected Result

-   The application loads successfully.
-   No blank screen appears.
-   No critical application error appears in the browser console.

------------------------------------------------------------------------

## ST-002: Dashboard Opens

### Prerequisite

Use a user with dashboard access.

### Steps

1.  Open the application.
2.  Navigate to Dashboard.

### Expected Result

-   Dashboard loads successfully.
-   The dashboard layout is visible.
-   Available dashboard sections render according to the user's feature
    access.

------------------------------------------------------------------------

## ST-003: Navigation Works

### Steps

1.  Open the application navigation.
2.  Select each page available to the test user.
3.  Return to the Dashboard.

### Expected Result

-   Each available navigation item opens the correct page.
-   Navigation does not produce a blank screen.
-   The user can return to the Dashboard.

------------------------------------------------------------------------

## ST-004: Page Access Restriction

### Prerequisite

Use a user without access to a selected page.

### Steps

1.  Sign in as the restricted user.
2.  Inspect the navigation.
3.  Attempt to access the restricted page directly if the application
    supports direct URLs.

### Expected Result

-   The restricted page does not appear in navigation.
-   Direct access is also protected.

------------------------------------------------------------------------

## ST-005: Action Access Restriction

### Prerequisite

Use a user who can access a page but does not have permission for a
specific action.

### Steps

1.  Open the relevant page.
2.  Locate the restricted action.

### Expected Result

-   The restricted action is not available to the user.
-   Other permitted actions remain available.

------------------------------------------------------------------------

## ST-006: Feature Flag Off

### Prerequisite

Disable a feature for the test user.

### Steps

1.  Open the relevant page.
2.  Inspect the area controlled by the feature flag.

### Expected Result

-   The restricted feature does not render.
-   The page remains usable.
-   No broken empty section is left behind.

------------------------------------------------------------------------

## ST-007: Feature Flag On

### Prerequisite

Enable the feature for the test user.

### Steps

1.  Open the relevant page.
2.  Inspect the feature-controlled area.

### Expected Result

-   The feature renders.
-   Its available data or controls are visible according to the user's
    permissions.

------------------------------------------------------------------------

## ST-008: Mock Telemetry Renders

### Prerequisite

Mock telemetry is enabled.

### Steps

1.  Open the Dashboard.
2.  Open the Power page.
3.  Inspect available telemetry values.

### Expected Result

-   Mock telemetry is displayed using the application data structures.
-   Values are formatted with appropriate units.
-   Missing values do not break the interface.

------------------------------------------------------------------------

## ST-009: Source Status Displays

### Steps

1.  Open the Dashboard.
2.  Inspect the source-status area.

### Expected Result

-   Solar, grid, and generator states display when corresponding data is
    available.
-   The active source is clearly distinguishable.
-   Status information remains readable on smaller screens.

------------------------------------------------------------------------

## ST-010: Power Flow Visualization

### Steps

1.  Open the Dashboard.
2.  Locate the power-flow visualization.
3.  Observe the visualization with mock source states.

### Expected Result

-   The visualization loads.
-   The current source state is represented correctly according to the
    mock data.
-   Motion does not prevent the user from reading the surrounding
    information.

------------------------------------------------------------------------

## ST-011: Alert Flow

### Prerequisite

Use mock data that produces an alert.

### Steps

1.  Open the Dashboard or Alerts page.
2.  Trigger or load the relevant mock alert state.

### Expected Result

-   The alert appears.
-   Its severity is understandable.
-   The alert does not cover critical controls or telemetry.
-   The interface remains usable.

------------------------------------------------------------------------

## ST-012: HMI Access Flow

### Prerequisite

Use a user with HMI access.

### Steps

1.  Open the HMI page or HMI controls.
2.  Select an available source-control action.
3.  Review the command confirmation/processing state.

### Expected Result

-   The control is available to an authorized user.
-   The application shows the appropriate processing state.
-   The command flow does not bypass the access-control layer.

Do not send real device commands during mock testing.

------------------------------------------------------------------------

## ST-013: HMI Restricted Action

### Prerequisite

Use a user who has HMI page access but does not have permission for a
specific HMI action.

### Steps

1.  Open the HMI page.
2.  Inspect the restricted action.

### Expected Result

-   The restricted action is hidden. It is not shown as a disabled
    control.
-   Other permitted HMI functionality remains available.

------------------------------------------------------------------------

## ST-014: Loading State

### Steps

1.  Open a page that loads asynchronous data.
2.  Observe the interface while data is loading.

### Expected Result

-   A clear loading state is displayed.
-   Loading animation does not block essential information
    unnecessarily.
-   Reduced-motion preferences are respected.

------------------------------------------------------------------------

## ST-015: Error State

### Prerequisite

Use a controlled mock/service failure.

### Steps

1.  Open a page that depends on the failed service.
2.  Observe the resulting state.

### Expected Result

-   A clear error state is displayed.
-   The application does not become unusable.
-   The user can understand that data is unavailable.

------------------------------------------------------------------------

## ST-016: Responsive Navigation

### Steps

1.  Open the application on a desktop-sized viewport.
2.  Resize to a tablet-sized viewport.
3.  Resize to a small mobile-sized viewport.
4.  Open and use the navigation at each size.

### Expected Result

-   Navigation remains usable.
-   No important controls are clipped.
-   No horizontal overflow is introduced unnecessarily.
-   Content remains readable.

------------------------------------------------------------------------

## ST-017: Responsive Dashboard

### Steps

1.  Open the Dashboard on desktop.
2.  Check tablet width.
3.  Check small mobile width.

### Expected Result

-   Dashboard sections adapt to the available width.
-   Cards and charts remain readable.
-   Important status information remains accessible.
-   No major layout overlap occurs.

------------------------------------------------------------------------

## ST-018: Reduced Motion

### Prerequisite

Enable the operating system/browser reduced-motion preference.

### Steps

1.  Open the application.
2.  Visit areas containing animation.

### Expected Result

-   Non-essential motion is reduced or disabled.
-   Information remains understandable without animation.
-   The application remains functional.

------------------------------------------------------------------------

## ST-019: Admin Feature Management

### Prerequisite

Use an administrator account.

### Steps

1.  Open the Admin module.
2.  Open feature management.
3.  Change a feature's access for a test user.
4.  Return to the relevant application area.

### Expected Result

-   Only authorized administrators can manage feature access.
-   The feature visibility changes according to the updated access
    state.

------------------------------------------------------------------------

## ST-020: Non-Admin Cannot Manage Features

### Prerequisite

Use a non-admin account.

### Steps

1.  Inspect navigation.
2.  Attempt to access the Admin feature-management area directly.

### Expected Result

-   Admin-only navigation is unavailable.
-   Direct access is protected.

------------------------------------------------------------------------

## ST-021: Root URL Opens Dashboard

### Steps

1.  Open the application root URL (`/`).

### Expected Result

-   The browser is redirected to `/dashboard`.
-   The Dashboard page heading is shown.
-   The browser tab title reads "Dashboard · ATS Dashboard".

------------------------------------------------------------------------

## ST-022: Unknown Route

### Steps

1.  Open a URL that does not exist, for example `/does-not-exist`.
2.  Select "Go to Dashboard".

### Expected Result

-   A "Page not found" page is shown inside the application shell.
-   Navigation remains available.
-   "Go to Dashboard" opens the Dashboard.

------------------------------------------------------------------------

## ST-023: Mobile Navigation Drawer

### Prerequisite

Use a viewport narrower than 1024px.

### Steps

1.  Select the menu button in the top bar.
2.  Select a navigation item.
3.  Open the drawer again and press Escape.
4.  Open the drawer again and tap the dimmed area outside it.

### Expected Result

-   The drawer opens and keyboard focus moves into it.
-   The page behind the drawer cannot be scrolled or focused.
-   Selecting a navigation item opens the page and closes the drawer.
-   Escape and tapping outside both close the drawer.
-   After closing, focus returns to the menu button.
-   The active page is marked in the drawer.

------------------------------------------------------------------------

## ST-024: Skip to Content

### Steps

1.  Open any page.
2.  Press Tab once.
3.  Press Enter.

### Expected Result

-   A "Skip to content" link becomes visible on the first Tab.
-   Pressing Enter moves focus to the main content area.

------------------------------------------------------------------------

## ST-025: Disabled Account

### Prerequisite

Select "Mock Disabled User".

### Steps

1.  Open any page, including a direct URL such as `/power`.

### Expected Result

-   No navigation items are shown.
-   An "Account disabled" message is shown instead of page content.

------------------------------------------------------------------------

## ST-026: Access Changes Apply Immediately

### Steps

1.  As "Mock Administrator", open `/admin`.
2.  Switch the mock user to "Mock Viewer".

### Expected Result

-   Administration disappears from the navigation.
-   The current page changes to "Access denied" without a reload.

------------------------------------------------------------------------

## ST-027: Connection and Freshness

### Steps

1.  Open the Dashboard and note the connection status ("Connected").
2.  Select the "Stale telemetry" scenario and wait about 10 seconds.
3.  Select "Disconnected".
4.  Select "Normal operation".

### Expected Result

-   Step 2: telemetry is marked as stale; values are not presented as
    live.
-   Step 3: the connection status shows "Disconnected" and telemetry is
    marked as disconnected.
-   Step 4: the status returns to "Connected" and data is live again.

------------------------------------------------------------------------

## ST-028: Dashboard Sections Follow Feature Access

### Steps

1.  As "Mock Administrator", open the Dashboard.
2.  Switch to "Mock Viewer".
3.  Switch to "Mock Viewer (no Financial)".

### Expected Result

-   Step 1: core sections (power flow, system overview, tariff,
    temperature, source status) plus Load, Active alarms, Today's energy
    cost and HMI remote control are shown.
-   Step 2: the HMI section disappears; the other sections remain.
-   Step 3: the financial section ("Today's energy cost") also
    disappears. No empty gap is left behind.

------------------------------------------------------------------------

## ST-029: Power Flow Follows the Active Source

### Steps

1.  Open the Dashboard and locate the power-flow diagram.
2.  Note the active source in "System overview".
3.  Select the "Stale telemetry" scenario and wait about 10 seconds.

### Expected Result

-   The highlighted path runs from the active source through the ATS to
    the load, and only that path shows moving energy.
-   The ATS box shows "On <source>".
-   With stale data the movement stops, the ATS box shows "Not live" and
    a "Stale data" notice appears above the dashboard.
-   With reduced motion enabled, the path is static with a direction
    arrow.

------------------------------------------------------------------------

## ST-030: Power Parameters and Missing Values

### Steps

1.  As "Mock Viewer", open Power.
2.  Select the "Missing / empty data" scenario.

### Expected Result

-   Load, Solar, Ghana Utility/Grid and Generator cards show voltage,
    current, power, energy, frequency and power factor with units.
-   Each source card shows its status (Active, Standby, Unavailable).
-   In step 2, fields the system does not provide are shown as "—"
    (announced as "Unavailable"), never as 0.

------------------------------------------------------------------------

## ST-031: Alerts Page and Alarm Banner

### Steps

1.  As "Mock Viewer", select the "Active alarms" scenario.
2.  Open the Dashboard, then the Alerts page.
3.  Switch the alert filter between Active, Cleared and All.
4.  Select "Normal operation".
5.  Switch to "Mock HMI Observer" with "Active alarms" selected, then
    revoke the Alerts feature for that user in Administration (or use a
    user without Alerts access).

### Expected Result

-   A banner above the page content lists the active alarms with
    severity text and shape (not color alone) and a "View alerts" link.
-   The banner does not cover any controls or telemetry.
-   Active alarms are listed first, critical before warning.
-   Each filter shows its count; an empty filter shows an empty state.
-   After step 4 the banner disappears and "Active" shows "No active
    alarms".
-   Users without Alerts access see neither the banner nor the page.

------------------------------------------------------------------------

## Maintenance Rule

When a new completed feature introduces an important user flow:

1.  Add a small smoke test to this document.
2.  Keep the test straightforward.
3.  Do not turn the smoke test into a unit-test specification.
4.  Keep the smoke-test update in the same logical change or in a small
    dedicated documentation commit.

If a test depends on behavior that has not yet been confirmed by the
project documentation, mark the dependency as TBD rather than inventing
behavior.
