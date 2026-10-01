# ATS Dashboard Specification

## 1. Project Purpose

Build a responsive custom web dashboard for the Automatic Transfer
System (ATS) and energy-management project.

The application will provide:

-   live system information
-   power-source telemetry
-   financial and energy analytics
-   condition awareness
-   HMI remote controls
-   user/role/permission management
-   feature-based access control
-   responsive desktop, tablet, and mobile interfaces
-   polished, purposeful motion and animation

The dashboard is an application layer around the existing Node-RED/ATS
system. It must not invent or hardcode production telemetry.

------------------------------------------------------------------------

## 2. Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   Tailwind CSS

### Explicitly not used

-   TypeScript
-   Bootstrap
-   jQuery

Use JavaScript files such as `.js` and `.jsx`.

------------------------------------------------------------------------

## 3. Existing System Integration

The existing ATS system uses:

-   Modbus TCP for temperature and contactor coil status
-   MQTT for PZEM-004T sensor data
-   Node-RED as the existing processing/control layer

The existing Node-RED flow contains a `/ws/telemetry` WebSocket section,
but this is **not confirmed as the frontend integration method**.

The application must therefore use an integration adapter/transport
abstraction rather than coupling React directly to an assumed transport.

The final transport may be:

-   HTTP/REST
-   WebSocket
-   SSE
-   another supported interface

The decision must be based on the actual integration contract
established with the existing system.

------------------------------------------------------------------------

# 4. Dashboard Scope

## 4.1 Home Dashboard

The home dashboard should support:

-   live tariff
-   temperature monitoring
-   source/status indicators
-   HMI remote control
-   animated power-flow diagram
-   important alerts
-   current system summary

The dashboard itself is a standard/core page.

However, individual dashboard sections and data are feature-dependent.

If a user does not have access to a dashboard feature:

-   the section must not render
-   its data must not unnecessarily be fetched
-   related actions must not be shown

If the feature is granted:

-   the relevant section becomes available according to the user's
    permissions.

------------------------------------------------------------------------

## 4.2 Power Parameters

Support telemetry for:

-   load
-   generator
-   grid
-   solar

Possible measurements include:

-   voltage
-   current
-   power
-   energy
-   frequency
-   power factor
-   source status
-   temperature where applicable

The exact production payload must come from the integration contract.

------------------------------------------------------------------------

## 4.3 Financial Analytics

Support:

-   source usage percentage
-   ATS transition metrics
-   live tariff information
-   active source
-   energy consumption
-   cost trend graphs
-   daily cost trend
-   monthly cost trend
-   yearly cost trend
-   energy-source costs
-   power-factor losses
-   data export

Do not fabricate financial telemetry.

Mock/demo values are allowed during development, but must be clearly
isolated from production integration.

------------------------------------------------------------------------

## 4.4 Condition Awareness

Support:

-   live alarm banner
-   visual alerts
-   system condition indicators
-   connection/integration warnings
-   source/ATS warnings where supported by the system

------------------------------------------------------------------------

## 4.5 HMI Remote Control

Authorized users may perform supported HMI actions such as:

-   changing the active source/input
-   changing input cost/day

Commands must go through the application integration layer.

React must never directly communicate with field devices.

Every command must have:

1.  permission check
2.  feature check where applicable
3.  validation
4.  command submission
5.  processing state
6.  success/failure result
7.  user-visible feedback

------------------------------------------------------------------------

# 5. Authentication, Roles, Permissions and Features

## 5.1 Users

The system supports individual user accounts.

## 5.2 Roles

Initial proposed roles:

-   Admin
-   Operator
-   Viewer

The final role model may expand after requirements are confirmed.

## 5.3 Permissions

Permissions should be granular.

Examples:

-   `dashboard.view`
-   `power.view`
-   `financial.view`
-   `financial.export`
-   `alerts.view`
-   `hmi.view`
-   `hmi.changeSource`
-   `hmi.changeCost`
-   `admin.view`
-   `admin.users.view`
-   `admin.users.manage`
-   `admin.features.view`
-   `admin.features.manage`
-   `admin.permissions.view`
-   `admin.permissions.manage`

Permission names follow the `.view` / `.manage` convention defined in
`06_AUTH_AND_FEATURE_FLAGS.md`, which is the source of truth for
permission naming.

## 5.4 Page Access

If a user does not have access to a page:

-   hide the navigation item
-   prevent direct route access

## 5.5 Action Access

A user may have access to a page without having permission to perform
every action on that page.

Example:

A user may view HMI information but not change the active source.

In this case:

-   the HMI page remains visible
-   the source-change control is hidden

Unauthorized actions are hidden. Do not show them as disabled
controls.

### Access Rule Summary

-   No page access: hide the navigation item and protect the route.
-   Page access but no action permission: hide the action.
-   No feature access: do not render the feature or dashboard section.

## 5.6 Feature Flags

Feature access is managed from the Admin module.

Only authorized administrators can manage feature access.

Feature flags may control:

-   dashboard sections
-   analytics sections
-   HMI capabilities
-   advanced alerts
-   exports
-   other optional application features

The effective UI is determined by:

**user + role + permission + feature access**

UI visibility is not a security boundary. Backend/integration
authorization must still enforce the same rules.

------------------------------------------------------------------------

# 6. Responsive Design Requirement

Responsiveness is a first-class requirement.

The application must be designed for:

-   desktop
-   laptop
-   tablet
-   small tablets
-   mobile phones
-   small mobile screens

Do not build desktop-first layouts that merely shrink.

Use responsive layouts intentionally.

Important areas include:

-   navigation
-   dashboard cards
-   telemetry tables
-   charts
-   power-flow diagram
-   HMI controls
-   modals
-   dropdowns
-   admin user management
-   permission management
-   feature management
-   alerts
-   data export controls

Charts and complex visualizations must remain usable on small screens.

Touch targets must be appropriate for mobile use.

------------------------------------------------------------------------

# 7. Animation and Motion System

Animation is a deliberate part of the product design.

The interface should feel polished and alive without becoming
distracting or resembling a generic template.

Two external resources are approved references for reusable animation
patterns:

## 7.1 Transitions.dev

Repository:

https://github.com/Jakubantalik/transitions.dev

Library:

https://transitions.dev/library.html

The repository's license states that the free transitions and skills can
be used in unlimited personal and commercial projects, modified, and
shipped as part of another product. The transition library itself must
not be redistributed as a competing library or template collection.

Use the free transition patterns where appropriate.

Useful categories include:

-   card resize
-   number pop-in
-   notification badge
-   text-state swaps
-   dropdown/menu transitions
-   modal open/close
-   panel reveal
-   page transitions
-   icon swaps
-   success states
-   error states
-   tabs
-   skeleton/reveal
-   spinner-to-check
-   toggles
-   tooltips
-   shimmer effects
-   thinking states
-   other suitable free transitions

Do not copy the transitions.dev website branding, visual identity, or
website design.

Use the transition ideas/components as part of this product's own visual
system.

### Recommended usage

Use transitions for:

-   navigation changes
-   page entry/exit
-   card expansion
-   chart/data updates
-   number changes
-   dropdown opening
-   modal opening
-   toast/notification entry
-   success/failure feedback
-   tab changes
-   loading/skeleton states
-   button/icon state changes
-   status changes

Do not animate every element simply because animation is available.

------------------------------------------------------------------------

# 8. Thinking Orbs

Repository:

https://github.com/RareFormLabs/thinking-orbs

Installed package: `thinking-orbs` 0.3.2 from npm. The installed
package metadata lists its repository as
`https://github.com/Jakubantalik/Libraries.dev` (directory
`packages/thinking-orbs`), not the repository linked above. Its
documented API (`<ThinkingOrb state size theme />`, the nine states
below, and a static frame under `prefers-reduced-motion: reduce`)
matches the behavior described in this section. Use the installed
package's API as the source of truth.

The installed package provides two tuned sizes only: `64` and `20`.

The library is suitable for this project and provides nine animated
states:

-   `working`
-   `searching`
-   `solving`
-   `listening`
-   `connecting`
-   `weaving`
-   `composing`
-   `breathing`
-   `shaping`

It uses a plain 2D canvas renderer and supports:

-   automatic light/dark theme handling
-   reduced-motion behavior
-   off-screen pausing
-   hidden-tab pausing
-   device-pixel-ratio limiting
-   accessible labels

Use Thinking Orbs where the interface is communicating an asynchronous
or processing state.

### Appropriate use cases

Examples:

-   loading system data
-   processing telemetry
-   connecting to the ATS integration
-   reconnecting to Node-RED/integration services
-   processing an HMI command
-   calculating analytics
-   exporting data
-   applying configuration
-   waiting for a system response
-   background analysis
-   system initialization

Map the visual state to the meaning of the operation.

For example:

-   `connecting` → connection establishment
-   `searching` → retrieving/searching for data
-   `working` → general processing
-   `solving` → analysis/calculation
-   `listening` → waiting/listening for system data
-   `composing` → preparing output/export
-   `breathing` → calm ongoing processing
-   `shaping` → system/data transformation
-   `weaving` → combining multiple data streams

The exact mapping may be refined during implementation.

------------------------------------------------------------------------

# 9. Animation Usage Rules

Animation must serve meaning.

### Use animation for

-   state changes
-   feedback
-   processing
-   loading
-   navigation
-   data updates
-   visual hierarchy
-   system activity
-   interaction confirmation

### Avoid animation for

-   critical controls that must be immediately readable
-   safety-critical information
-   constantly moving decorative backgrounds
-   every card on every render
-   unnecessary looping animations
-   anything that makes telemetry difficult to read

The power-flow visualization may use continuous motion because it
represents energy movement.

Other continuous animation must have a clear reason.

------------------------------------------------------------------------

# 10. Motion Accessibility

Every animated feature must respect:

`prefers-reduced-motion`

When reduced motion is enabled:

-   remove non-essential motion
-   use static states where possible
-   preserve information
-   preserve usability
-   do not remove critical status feedback

Thinking Orbs already provides reduced-motion behavior and should retain
that behavior.

Transition implementations must also include appropriate reduced-motion
handling.

------------------------------------------------------------------------

# 11. Animation Performance

Animation must remain performant on:

-   modern desktop browsers
-   normal laptops
-   tablets
-   mid-range mobile devices
-   small mobile screens

Prefer:

-   CSS transforms
-   CSS opacity
-   efficient canvas rendering
-   GPU-friendly transforms where appropriate
-   limited DOM work
-   avoiding layout-triggering animations
-   avoiding unnecessary React re-renders

Do not introduce a large animation dependency merely for a small visual
effect.

Measure before adding heavy animation tooling.

------------------------------------------------------------------------

# 12. Animation Architecture

Animations should be treated as a reusable application layer.

Animation code follows the repository structure defined in
`10_REPOSITORY_STRUCTURE.md`:

-   reusable animated components live in `src/components/`
-   animation helpers and library setup live in `src/lib/`
-   ATS-specific visualizations such as the power flow live in the
    relevant feature folder under `src/features/`

A separate `src/animations/` folder is not used.

Create reusable wrappers instead of scattering animation implementation
throughout pages.

Examples:

``` text
AnimatedCard
AnimatedNumber
AnimatedPanel
AnimatedModal
AnimatedDropdown
AnimatedStatus
ThinkingStatus
PageTransition
```

These are conceptual components. Create only when they provide real
reuse.

------------------------------------------------------------------------

# 13. Power Flow Animation

The animated power-flow diagram is a core dashboard visualization.

It should communicate:

-   available sources
-   active source
-   energy direction
-   switching
-   source transitions
-   load connection
-   system state

The animation must remain readable.

It must not depend on an unrelated external animation library if a
custom visualization is more appropriate.

Possible visual behavior:

-   moving energy particles
-   directional flow
-   active-source highlighting
-   transition animation
-   source connection/disconnection
-   fault/interruption indication

The exact visual implementation is a design/engineering task and should
be validated on mobile as well as desktop.

------------------------------------------------------------------------

# 14. Loading and Processing States

Loading states should be intentional.

Use:

-   skeletons for content-heavy layouts
-   Thinking Orbs for meaningful processing/connection states
-   simple spinners only when appropriate
-   transitions when content enters or changes

Avoid showing a spinner for every tiny operation.

Long-running operations should communicate what is happening.

Example:

``` text
Connecting to ATS...
Retrieving live telemetry...
Processing source transition...
Calculating financial analytics...
Exporting report...
```

The message and animation should communicate the same state.

------------------------------------------------------------------------

# 15. Data Rules

Production telemetry must never be hardcoded into UI components.

Use:

``` text
integration data
      ↓
adapter
      ↓
application data model
      ↓
state layer
      ↓
components
```

Mock data is permitted for development.

Mock data must:

-   live separately from production integration
-   follow the same data structures
-   be switchable
-   never silently become production data

------------------------------------------------------------------------

# 16. Integration Rules

The React application must not directly access:

-   PLCs
-   PZEM devices
-   Modbus devices
-   MQTT devices
-   field hardware

The integration layer is responsible for communication with the existing
system.

The frontend communicates with the application integration boundary.

This allows the transport to change without rewriting the UI.

------------------------------------------------------------------------

# 17. Real-Time Data

The system should support real-time or near-real-time updates where
required.

Potential data includes:

-   active source
-   voltage
-   current
-   power
-   energy
-   frequency
-   power factor
-   temperature
-   tariff
-   alarms
-   source status
-   transition status

The actual update frequency must be determined from the existing system
and integration contract.

Do not invent telemetry frequency.

------------------------------------------------------------------------

# 18. Error Handling

The interface must clearly handle:

-   integration unavailable
-   stale telemetry
-   failed commands
-   invalid commands
-   authorization failures
-   feature unavailable
-   authentication failures
-   network failures
-   partial data
-   missing data

Errors should be visible without destroying the entire dashboard.

Use appropriate motion for error feedback, but never make critical
errors dependent on animation.

------------------------------------------------------------------------

# 19. Admin Module

Admin functionality includes:

-   user management
-   role management
-   permission management
-   feature management
-   access configuration

Only authorized administrators can manage these areas.

The Admin UI must also be responsive.

Tables should transform appropriately on smaller screens rather than
forcing users to horizontally scroll through an enormous desktop table
unless horizontal scrolling is genuinely the most usable solution.

------------------------------------------------------------------------

# 20. Development Rules

Before implementing a feature:

1.  Read the project documentation.
2.  Check whether the required data/behavior is confirmed.
3.  Do not invent production integration details.
4.  Use the existing application data contract.
5.  Check permissions and feature access.
6.  Check responsive behavior.
7.  Check whether an existing animation component can be reused.
8.  Respect reduced-motion requirements.
9.  Keep mock and production integration separate.
10. Test the feature before moving to the next one.

When a technical decision changes, update the relevant specification
before continuing.

------------------------------------------------------------------------

# 21. Definition of Done

A feature is not complete until:

-   desktop layout works
-   mobile layout works
-   small-screen layout works
-   permissions are respected
-   feature flags are respected where applicable
-   loading states exist
-   error states exist
-   appropriate animation exists where useful
-   reduced-motion behavior works
-   production data is not hardcoded
-   mock data remains separated
-   integration boundaries are respected
-   no unnecessary dependencies were introduced
-   the application builds successfully
-   relevant tests pass

------------------------------------------------------------------------

# 22. External References

### Transitions.dev

Repository:

https://github.com/Jakubantalik/transitions.dev

Library:

https://transitions.dev/library.html

License:

https://github.com/Jakubantalik/transitions.dev/blob/main/LICENSE

### Thinking Orbs

Repository:

https://github.com/RareFormLabs/thinking-orbs

Use the official repositories as the source of truth for current
installation/API details during implementation.

------------------------------------------------------------------------

# 23. Important Principle

The goal is not to make the dashboard animated for the sake of
animation.

The goal is:

**A serious energy-management dashboard with excellent visual feedback,
meaningful motion, strong responsiveness, clear system states, and a
polished modern interface.**

Animation should make the system easier to understand, not harder.

------------------------------------------------------------------------

# 24. Visual Design Direction

## 24.1 Decision

The project owner selected Option B from
`08_ATS_FULL_DEVELOPMENT_PLAN.md` Section 6: the design direction is
proposed from the ATS product, the dashboard purpose and professional
UI standards.

The chosen direction is an **industrial control-room interface**: a
calm, neutral, dark operational surface where color is reserved for
system state. It follows the intent of high-performance HMI practice
(ISA-101): the normal state is visually quiet, so abnormal states stand
out immediately.

It is deliberately **not** a generic SaaS dashboard.

## 24.2 Principles

1.  **Neutral by default.** Backgrounds, surfaces, borders and text are
    cool neutral grays. Decorative color is not used.
2.  **Color carries meaning.** Saturated color is used for status,
    alarms, interaction focus and data series only.
3.  **Status is never color-only.** Every status also has a text label,
    and an icon or shape where useful.
4.  **Numbers first.** Telemetry and financial values use tabular
    figures, explicit units and a clear value/label hierarchy.
5.  **Flat and bordered.** Surfaces are separated by borders and
    tone, not heavy shadows, gradients or glass effects.
6.  **Restrained motion.** Motion follows Sections 7–14. Continuous
    motion is limited to the power-flow visualization.
7.  **Mobile is first-class.** Layouts are designed for small mobile
    screens as well as desktop (Section 6).

Not used: random gradients, glassmorphism, neon glows, decorative
illustrations, background animation, or color used only for
decoration.

## 24.3 Theme

The application has a dark theme (the original design, unchanged) and a
light theme (Section 24.10), selected with a toggle in the application
shell.

Dark was chosen as the primary design because the dashboard is an
always-on monitoring surface. A dark neutral (not pure black) background
reduces glare and lets status colors read clearly.

## 24.4 Color Tokens

Tokens are defined once as Tailwind theme variables in
`src/styles/index.css` and used through Tailwind utilities (for example
`bg-surface`, `text-muted`, `border-border`). Components must not use
arbitrary color values.

### Neutrals

  Token             Value       Use
  ----------------- ----------- ------------------------------------
  `canvas`          `#0f1417`   Page background
  `surface`         `#161c20`   Cards, panels, navigation
  `raised`          `#1d252a`   Hover and nested surfaces
  `border`          `#2b353c`   Decorative dividers and card borders
  `control`         `#64727c`   Form-control and interactive borders
  `text`            `#e7ecef`   Primary text and values
  `muted`           `#a3afb8`   Secondary text and labels
  `subtle`          `#8794a0`   Tertiary text and metadata

### Interaction

  Token             Value       Use
  ----------------- ----------- ------------------------------------
  `accent`          `#5aa2e6`   Focus rings, active navigation,
                                primary actions

### Status

  Token             Value       Meaning
  ----------------- ----------- ------------------------------------
  `ok`              `#3fb27f`   Normal / live / healthy
  `warning`         `#e0a43a`   Warning / stale data
  `critical`        `#ef6461`   Critical alarm / fault / failure
  `info`            `#5aa2e6`   Informational
  `offline`         `#8794a0`   Disconnected / unavailable / unknown

### Contrast

All text and status tokens meet WCAG AA (at least 4.5:1) on `canvas`,
`surface` and `raised`. The lowest measured ratio is `critical` on
`raised` at 4.94:1.

`control` meets the 3:1 non-text contrast requirement on all three
backgrounds. `border` is decorative and must not be the only boundary
of an interactive control.

### Source Identity Colors

  Token               Value       Source
  ------------------- ----------- ------------------
  `source-solar`      `#c98500`   Solar
  `source-grid`       `#3987e5`   Ghana Utility/Grid
  `source-generator`  `#d55181`   Generator

Validated as a three-color categorical set on `surface` with the
data-visualization palette validator (all pairs, dark mode): every
check passes; worst color-vision-deficiency separation ΔE 13.2, worst
normal-vision separation ΔE 19.3, all at least 3:1 against `surface`.
The fixed order is solar, grid, generator everywhere.

Measured limitation: with green, amber, red and blue taken by status and
interaction, no available hue is fully separated from every status
color. Solar vs `warning` measures ΔE 8.9 and generator vs `critical`
ΔE 8.8 (below the 15 normal-vision floor). Therefore:

-   a source color is always paired with the source name (legend, direct
    label or text);
-   a status color is always paired with its label and shape
    (`StatusIndicator`);
-   status colors are never used as series colors and source colors are
    never used to indicate status.

## 24.5 Typography

-   Font: the platform system UI font stack. No web font is loaded,
    which avoids an extra network dependency for an operational tool.
-   Numeric values: tabular figures (`tabular-nums`) so changing values
    do not shift the layout.
-   Base size: 16px. Labels and metadata are not smaller than 12px.
-   Hierarchy comes from size, weight and the `text` / `muted` /
    `subtle` tokens rather than from color.

## 24.6 Shape, Spacing and Elevation

-   Spacing: the Tailwind 4px spacing scale.
-   Radius: small and consistent (`rounded-md` for controls,
    `rounded-lg` for cards and panels).
-   Elevation: borders and surface tone. Shadows are reserved for
    overlays such as the mobile navigation drawer and modals.

## 24.7 Layout and Breakpoints

Tailwind's default breakpoints are used:

  Breakpoint   Min width   Typical device
  ------------ ----------- ------------------------
  (base)       0           Small mobile (from 320px)
  `sm`         640px       Large mobile
  `md`         768px       Tablet
  `lg`         1024px      Laptop
  `xl`         1280px      Desktop

-   Below `lg`: a top bar with a menu button that opens a navigation
    drawer.
-   From `lg`: a persistent sidebar.
-   Touch targets are at least 44px high on touch-sized layouts.
-   No horizontal page scrolling at 320px width.

## 24.8 Interaction States

-   Focus: a visible 2px `accent` focus ring on every interactive
    element (`focus-visible`).
-   Hover: a tone change to `raised`, never a color-only change of
    meaning.
-   Active navigation: `accent` indicator plus `aria-current="page"`.
-   Unauthorized actions are hidden (Section 5.5), so no "disabled for
    permission reasons" visual state exists.

## 24.9 Motion Tokens

-   Fast: 150ms, ease-out — hover and small state changes.
-   Standard: 200ms, ease-out — drawers, panels and menus.
-   Under `prefers-reduced-motion: reduce`, transitions are removed and
    the end state is shown immediately.

## 24.10 Light Theme

Both themes use the same token names; only the values differ. Dark
values are defined in `@theme`; light values override them under
`:root[data-theme="light"]` in `src/styles/index.css`. Components never
reference theme-specific colors.

### Theme selection

-   A toggle (sun/moon icon button) in the sidebar header and the mobile
    top bar switches the theme.
-   The choice is saved in `localStorage` (`ats-dashboard.theme`).
-   Without a saved choice the operating-system `prefers-color-scheme`
    is followed, including live changes. Browsers report `light` when
    the system has no explicit setting.
-   `public/theme-init.js` applies the theme before first paint (no
    flash). It is an external file because the Content-Security-Policy
    does not allow inline scripts; `src/lib/theme.js` manages changes.
-   Thinking Orbs use `theme="auto"`, which follows the `data-theme`
    attribute.

### Light tokens

  Token               Value       Token               Value
  ------------------- ----------- ------------------- -----------
  `canvas`            `#f3f5f7`   `accent`            `#1a66b8`
  `surface`           `#ffffff`   `ok`                `#16774a`
  `raised`            `#e9edf1`   `warning`           `#8f5b00`
  `border`            `#d3dae0`   `critical`          `#b42d24`
  `control`           `#76838e`   `info`              `#1a66b8`
  `text`              `#12181d`   `offline`           `#56636e`
  `muted`             `#47535e`   `source-solar`      `#b97a00`
  `subtle`            `#56636e`   `source-grid`       `#2a78d6`
                                  `source-generator`  `#c7407a`

### Light contrast (measured)

-   All text and status tokens are at least 4.5:1 on `canvas`, `surface`
    and `raised`; the lowest is `ok` on `raised` at 4.73:1.
-   `control` is at least 3:1 on all three backgrounds (3.30:1 on
    `raised`).
-   Primary buttons (`canvas` text on `accent`) measure 5.28:1.
-   Source colors pass the palette validator in light mode (all pairs):
    worst CVD separation ΔE 13.3, worst normal-vision ΔE 20.0, all at
    least 3:1 against `canvas`, `surface` and `raised`.
-   An automated audit of every page, in both themes at 375px and
    1440px (including the alarm banner and confirmation dialog), found
    no text below WCAG AA (lowest 4.73:1 light, 5.02:1 dark).

------------------------------------------------------------------------

# 25. Implemented Motion System

  Motion                       Where                        Reduced motion
  ---------------------------- ---------------------------- -------------------------
  Power-flow energy movement   Dashboard power-flow diagram Static path + arrow
  (moving dashes, only on the  (`features/dashboard/`)
  active path while live)
  Page enter (200ms fade/rise) Every route change           Removed
  Alarm banner enter           Live alarm banner            Removed
  Drawer slide (200ms)         Mobile navigation drawer     Removed
  Dialog enter                 HMI confirmation dialogs     Removed
  Color/tone transitions       Buttons, links, switches,    Removed
  (150ms)                      segmented controls
  Thinking Orbs                Meaningful waits only        Static frame (library)

Thinking Orbs mapping used (`components/LoadingState.jsx`, theme pinned
to dark):

  Orb state      Used for
  -------------- ---------------------------------------------------
  `connecting`   Session load, connecting to the ATS (system status)
  `listening`    Waiting for live electrical telemetry
  `searching`    Retrieving alarms, users and other lists
  `solving`      Calculating financial analytics
  `working`      HMI command processing (pending/accepted)

No artificial delays are added for visual effect. In mock mode the mock
adapter simulates network latency (~350 ms) so loading states are
exercised realistically; live timing depends on the integration.

Transition patterns are implemented as small Tailwind/CSS transitions
in this project's own visual system, following the Transitions.dev
categories (page entry, modal open, panel reveal, toggles); no
Transitions.dev code or branding is copied. Continuous motion is
limited to the power-flow visualization.
