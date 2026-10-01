# ATS Custom Dashboard --- Full Development Plan

## 1. Project Goal

Build a responsive custom web dashboard for the existing Automatic
Transfer System (ATS).

The dashboard will present system data clearly, provide approved remote
controls, and add useful energy and financial insights.

**Frontend:** React + Vite + JavaScript + Tailwind CSS\
**Deployment direction:** Netlify\
**Existing processing/control:** Node-RED

------------------------------------------------------------------------

## 2. What We Are Building

### Dashboard

-   Live tariff
-   Temperature
-   Source status
-   Animated power flow
-   Key system information

### Power

-   Solar telemetry
-   Grid telemetry
-   Generator telemetry
-   Load telemetry

### Financial

-   Source usage
-   Energy consumption
-   Source costs
-   Cost trends
-   Power factor losses
-   Exportable data

### Condition Awareness

-   Live alarms
-   Visual alerts

### HMI

-   Change active source/input
-   Change input cost/day
-   Show command status

### Admin & Access

-   Users
-   Roles
-   Permissions
-   Feature access
-   Page access
-   Action-level access

------------------------------------------------------------------------

## 3. Access Model

The dashboard is available as the standard application area.

However, individual sections and data can depend on feature access.

-   No page access → page is hidden from navigation.
-   Page access but no action permission → action/button is hidden.
-   No feature access → that feature or dashboard section does not
    appear.
-   Admin manages user access and feature availability.

This keeps the interface clean instead of showing controls users cannot
use.

------------------------------------------------------------------------

## 4. Integration Plan

The custom UI will **not communicate directly with the physical ATS
devices**.

The flow will be:

**ATS Devices → Existing Communication → Node-RED → Integration Layer →
Custom React UI**

### Data we expect to integrate

#### Electrical / Power Data

-   Voltage
-   Current
-   Power
-   Energy
-   Frequency
-   Power factor

#### Source Data

-   Solar status
-   Grid status
-   Generator status
-   Active source
-   Source usage/runtime

#### System Data

-   Temperature
-   Contactor/coil status
-   ATS state
-   Transition information

#### Financial Data

-   Active tariff
-   Energy consumption
-   Source cost
-   Cost totals
-   Cost trends
-   Power-factor-related financial information

#### Condition Data

-   Active alarms
-   Alert status
-   System warnings

### Remote Commands

The UI will also send approved commands through the integration layer,
such as:

-   Change active source
-   Change configured input cost/day

The exact production transport and command endpoints will be confirmed
from the existing Node-RED/ATS implementation before live integration.

------------------------------------------------------------------------

## 5. Development Order

### Phase 1 --- Confirm the Existing System

-   Review the ATS Node-RED flow.
-   Confirm available data.
-   Confirm command interfaces.
-   Confirm units and update frequency.
-   Finalize the application data contract.

### Phase 2 --- Build the Frontend Foundation

-   Create React + Vite application.
-   Configure Tailwind CSS.
-   Establish routing.
-   Create responsive application shell.
-   Create navigation and layout.
-   Prepare mobile, tablet and desktop behavior.

### Phase 3 --- Access & Feature Foundation

-   Authentication structure
-   Roles
-   Permissions
-   Page access
-   Action access
-   Feature flags
-   Admin access management

### Phase 4 --- Mock Integration

Build the complete UI using structured mock data.

This allows the interface to be completed before the live integration is
connected.

### Phase 5 --- Core Dashboard

Build: - Dashboard overview - Live system status - Temperature -
Tariff - Source status - Animated power flow

### Phase 6 --- Power & Condition Modules

Build: - Power telemetry - Source information - Alarms - Visual alerts

### Phase 7 --- Financial Module

Build: - Energy usage - Source usage - Costs - Cost trends - Power
factor information - Data export

### Phase 8 --- HMI Controls

Build: - Source switching controls - Cost/day configuration -
Confirmation states - Success/error feedback - Permission checks

### Phase 9 --- Live Integration

Replace mock data with the confirmed production integration.

Test: - Live telemetry - Data freshness - Commands - Errors -
Reconnection - Missing data

### Phase 10 --- Testing & Refinement

Test: - Desktop - Tablet - Mobile/small screens - Permissions - Feature
visibility - HMI actions - Charts - Alerts - Loading/error states -
Production build

### Phase 11 --- Deployment

-   Production environment configuration
-   Netlify deployment
-   Secure environment variables
-   Final integration checks
-   Production verification

------------------------------------------------------------------------

## 6. Design System Comes Before Detailed UI

After the functional plan is agreed, we will define the complete design
system before building the detailed interface.

The design system will define:

-   Brand/theme direction
-   Primary color
-   Secondary color
-   Accent colors
-   Background colors
-   Surface colors
-   Text colors
-   Status colors
-   Typography
-   Font sizes
-   Font weights
-   Spacing scale
-   Border radius
-   Borders
-   Shadows
-   Buttons
-   Inputs
-   Cards
-   Tables
-   Badges
-   Alerts
-   Modals
-   Navigation
-   Charts
-   Power-flow visuals
-   Responsive breakpoints
-   Interaction states

Once approved, the system will be followed consistently across the
entire application.

### Design Direction Decision

Before creating the design system, the project owner will choose either:

**Option A:** Provide preferred colors/theme.

**Option B:** Allow the design direction to be proposed based on the ATS
product, dashboard purpose and professional UI standards.

The selected direction will then become the project's visual foundation.

------------------------------------------------------------------------

## 7. Important Development Rules

-   No hardcoded production telemetry.
-   Mock data must be clearly separated from live integration.
-   React must not access physical devices directly.
-   Unknown integration details must be confirmed before implementation.
-   Access rules must be enforced beyond simple visual hiding.
-   The application must remain responsive.
-   The design system must be followed consistently.
-   Existing Node-RED control logic remains the source of truth for ATS
    processing/control unless the integration design is formally
    changed.
-   Documentation should be updated when confirmed architecture
    decisions change.

------------------------------------------------------------------------

## 8. Final Result

The completed system will provide:

**Existing ATS + Node-RED**

↓

**Integration Layer**

↓

**Custom Responsive React Dashboard**

↓

**Monitoring + Analytics + Alerts + Financial Insights + Controlled
HMI**

The goal is not just to recreate the existing dashboard.

It is to create a clean, responsive and maintainable application layer
around the existing ATS system.
