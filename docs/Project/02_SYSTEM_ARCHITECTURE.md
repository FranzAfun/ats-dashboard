# 02 System Architecture

## 1. Purpose

This document defines the current technical architecture for the
Automatic Transfer System (ATS) monitoring and energy-management
application.

The architecture is based on the existing Node-RED system and the
confirmed information from the project owner. The custom application
will extend the existing system rather than unnecessarily replace its
control logic.

------------------------------------------------------------------------

## 2. High-Level Architecture

The system has three main power sources:

1.  Solar
2.  Ghana Utility/Grid
3.  Generator

The existing control and monitoring layer is Node-RED.

The custom web application will provide the user-facing interface for
monitoring, analytics, alerts, HMI controls, and access-controlled
features.

### High-Level Flow

``` text
                    ┌─────────────────────┐
                    │   SOLAR / GRID /    │
                    │     GENERATOR       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │        ATS          │
                    │  Switching System   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌───────────────┐             ┌───────────────┐
        │  Modbus TCP   │             │   PZEM-004T   │
        │ Temperature + │             │   Electrical  │
        │ Contactor     │             │   Telemetry   │
        │ Status        │             │               │
        └───────┬───────┘             └───────┬───────┘
                │                             │
                │                             │ MQTT
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │      Node-RED       │
                    │ Processing / Logic  │
                    │ Monitoring / Control │
                    └──────────┬──────────┘
                               │
                               │ Confirmed Application Interface
                               ▼
                    ┌─────────────────────┐
                    │ Custom Web App      │
                    │ React + Vite        │
                    │ JavaScript          │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Access / Feature    │
                    │ Control Layer       │
                    └─────────────────────┘
```

------------------------------------------------------------------------

## 3. Power Sources

### 3.1 Solar

Solar is one of the available ATS power sources.

The application must be able to display relevant solar telemetry and
financial information where the existing system provides the required
data.

### 3.2 Ghana Utility/Grid

The Ghana utility/grid is one of the available ATS power sources.

The application must display relevant grid telemetry, active-source
information, tariff information, and associated financial data where
available.

### 3.3 Generator

The generator is one of the available ATS power sources.

The application must display relevant generator telemetry and associated
energy/cost information where available.

------------------------------------------------------------------------

## 4. Modbus TCP Layer

Modbus TCP is currently used for:

-   Temperature monitoring
-   Contactor coil status

The existing Node-RED system uses this information as part of ATS
monitoring and source-status logic.

The custom frontend must not directly assume or invent Modbus register
mappings.

### Rule

Any Modbus address, register, data type, scaling factor, or
device-specific configuration must come from the confirmed system
configuration.

------------------------------------------------------------------------

## 5. PZEM-004T and MQTT Layer

PZEM-004T sensors provide electrical measurements.

The confirmed architecture uses MQTT for communication from the
PZEM-004T sensor layer to Node-RED.

``` text
PZEM-004T
    │
    │ MQTT
    ▼
Node-RED
```

The exact MQTT broker, topic names, payload structures, and
retained-message behavior have not yet been finalized in the project
documentation.

These details must be documented before implementing the production
integration.

------------------------------------------------------------------------

## 6. Node-RED Layer

Node-RED is the existing processing and control layer.

It currently contains logic related to:

-   Source monitoring
-   Source usage analytics
-   Active source and tariff monitoring
-   ATS transition metrics
-   Energy and cost calculations
-   Power factor information
-   Dashboard values
-   Reset handling
-   Alerts and alarm-related logic
-   Existing HMI/dashboard controls

The supplied `ATS.json` also contains a WebSocket telemetry section, but
the project owner has confirmed that `/ws/telemetry` is not the intended
frontend integration method.

Therefore:

> Do not build the custom frontend around `/ws/telemetry` until the
> actual integration interface is explicitly confirmed.

------------------------------------------------------------------------

## 7. Custom Web Application

The custom application is responsible for presenting the system through
a modern web interface.

### Frontend Stack

-   React
-   Vite
-   JavaScript
-   Tailwind CSS

### Explicitly Not Used

-   Bootstrap
-   TypeScript
-   Hardcoded production telemetry
-   Unnecessary replacement of Node-RED logic

The frontend should consume structured data from the integration layer
rather than embedding system values directly into components.

------------------------------------------------------------------------

## 8. Dashboard Responsibilities

The custom application is expected to cover the following areas.

### Home

-   Live tariff
-   Temperature monitoring
-   Status indicators
-   HMI remote control
-   Animated power-flow diagram
-   Feature-dependent dashboard sections

### Power Parameters

-   Load telemetry
-   Generator telemetry
-   Grid telemetry
-   Solar telemetry

### Financial Analytics

-   Source usage percentage
-   ATS transition metrics
-   Live tariff information
-   Energy consumption
-   Cost trend graphs
-   Energy source costs
-   Power factor losses
-   Data export

### Condition Awareness

-   Live alarm banner
-   Visual alerts

------------------------------------------------------------------------

## 9. Users, Roles, Permissions, and Feature Access

The application shall support multiple users with role-based and
feature-based access.

The access model consists of:

``` text
User
 │
 ├── Role
 │
 └── Effective Access
      ├── Page / Navigation Access
      ├── Action Access
      └── Feature Access
```

### Page / Navigation Access

If a user does not have access to a page or module, the corresponding
navigation item shall not be displayed.

Example:

``` text
User
 ├── Dashboard       → visible
 ├── Power           → visible
 ├── Financial       → hidden
 └── HMI             → visible
```

### Action Access

A user may have access to a page while lacking permission for specific
actions within that page.

For example:

``` text
HMI
 ├── View current source       → visible
 ├── View telemetry            → visible
 ├── Change source             → visible
 └── Change input cost/day     → hidden
```

The UI shall not display controls for actions the user is not permitted
to perform.

### Feature Access

Features may be enabled or disabled through the administrative module.

Only authorized administrators shall be able to manage feature
availability for users.

Feature access can affect both navigation and content within the
dashboard.

------------------------------------------------------------------------

## 10. Dashboard Feature Visibility

The Dashboard is a standard/core section available to users according to
the application's baseline access model.

However, individual dashboard sections may depend on feature access.

Example:

``` text
Dashboard
 ├── Core system information
 ├── Power Monitoring section
 ├── Financial section
 ├── Alerts section
 └── HMI section
```

If a user does not have access to Financial Analytics, financial cards
and financial dashboard sections shall not be displayed.

If access is granted, the relevant dashboard section becomes available.

Therefore, the dashboard is not a single unrestricted data surface.

### Rule

> A user's dashboard data visibility must respect the same
> feature-access rules used throughout the application.

This prevents users from receiving feature-restricted information
through the Dashboard while the corresponding feature page remains
hidden.

------------------------------------------------------------------------

## 11. Administrative Module

The application shall include an administrative module for authorized
administrators.

The administrative module will eventually support:

-   User management
-   Role management where applicable
-   Permission management
-   Feature management
-   User-specific feature access
-   Access review

Feature flags that control user-facing capabilities shall be managed
through the administrative module rather than being changed manually in
frontend code.

------------------------------------------------------------------------

## 12. HMI Remote Control

The custom application must support remote HMI functions defined by the
project owner.

Confirmed controls include:

-   Changing the selected source/input
-   Manually changing input cost/day

These controls are safety-sensitive because they interact with the ATS
operating system.

The final command mechanism, validation rules, authorization model, and
failure handling must therefore be defined before implementation.

The frontend must never bypass required Node-RED or ATS control logic.

------------------------------------------------------------------------

## 13. Data Flow Principle

The architecture follows this principle:

``` text
Physical System
      ↓
Existing Communication Layer
      ↓
Node-RED
      ↓
Confirmed Application Interface
      ↓
Access / Feature Evaluation
      ↓
React Frontend
```

The application should only expose information and actions that the
current user is authorized to access.

------------------------------------------------------------------------

## 14. Demo Data

Demo data is allowed for dashboard development and visual testing.

Demo data must remain clearly separated from production telemetry.

Mock values must never silently become the production data source.

------------------------------------------------------------------------

## 15. Confirmed vs To Be Determined

### Confirmed

-   Three power sources: solar, Ghana utility/grid, generator
-   Node-RED is the existing control/processing layer
-   Modbus TCP is used for temperature and contactor coil status
-   MQTT is used for PZEM-004T sensors
-   React + Vite + JavaScript + Tailwind CSS will be used for the custom
    frontend
-   HMI needs source/input control
-   HMI needs manual input cost/day control
-   Demo data will be used for dashboard testing
-   `/ws/telemetry` is not the confirmed frontend integration method
-   Users require differentiated access
-   Feature availability can affect navigation, actions, and dashboard
    content
-   Feature management belongs in the administrative module

### To Be Determined

-   Exact roles
-   Exact permission names
-   Exact feature-flag list
-   Whether roles grant permissions directly or through role templates
-   Frontend-to-Node-RED integration mechanism
-   Exact telemetry payload schema
-   Exact command payload schema
-   MQTT broker details
-   MQTT topic structure
-   PZEM payload structure
-   Modbus register documentation
-   Authentication mechanism
-   Historical data storage mechanism
-   Financial analytics persistence
-   Production deployment architecture

------------------------------------------------------------------------

## 16. Architecture Rule for Development

Do not implement an integration simply because a technology appears in
the existing system.

Every integration must have:

1.  A confirmed source
2.  A defined data structure
3.  A defined direction of communication
4.  A clear ownership boundary
5.  A defined failure behavior
6.  A defined access boundary where user data or control is involved

This prevents the frontend from being built around assumptions that
later have to be thrown away.

------------------------------------------------------------------------

## 17. Current Architecture Status

The architecture is partially confirmed.

The physical communication paths and Node-RED responsibility are known.
The frontend integration contract and complete access model are not yet
finalized.

The next documentation will define the detailed authentication, roles,
permissions, and feature-flag model.
