
# ATS Dashboard

![STATUS](https://img.shields.io/badge/STATUS-ACTIVE_DEVELOPMENT-22c55e)

Custom web dashboard for an Automatic Transfer System (ATS) and energy-management system.

The system monitors and manages three electrical power sources:

- Solar
- Ghana utility/grid
- Generator

The dashboard provides live system visibility, power and energy information, financial analytics, condition awareness, and authorized HMI controls.

---

## Project Overview

The ATS system already has an existing control and processing layer built around Node-RED.

The custom dashboard is being developed as a separate frontend application that communicates with the existing system through a defined application integration layer.

The dashboard is responsible for presentation, user interaction, access-aware functionality, analytics visualization, and authorized HMI operations.

It does **not** communicate directly with physical devices.

### Existing System

The current system uses:

- **Node-RED** for system processing and control
- **Modbus TCP** for temperature monitoring and contactor coil status
- **MQTT** for PZEM-004T sensor data
- **ATS control logic** for source switching and system status

The exact production integration interface between Node-RED and the custom dashboard is still being finalized.

The frontend must not assume an undocumented API, MQTT topic, Modbus register, WebSocket endpoint, or command format.

---

## Main Dashboard Capabilities

### Dashboard

The dashboard provides the main system overview.

Planned capabilities include:

- Live tariff information
- Temperature monitoring
- Active source status
- System status indicators
- HMI remote control where authorized
- Animated power-flow visualization
- Feature-dependent dashboard sections

The dashboard itself is a standard application area, but individual dashboard data and sections may depend on the user's feature access.

---

### Power Parameters

Power monitoring includes:

- Load telemetry
- Generator telemetry
- Grid telemetry
- Solar telemetry
- Voltage
- Current
- Power
- Energy
- Frequency
- Power factor
- Source status

---

### Financial Analytics

Financial functionality includes:

- Source usage percentage
- ATS transition metrics
- Active source and tariff information
- Energy consumption
- Cost trends
- Daily cost information
- Monthly cost information
- Yearly cost information
- Energy source costs
- Power factor losses
- Data export

Financial information must come from the application data layer and must not be hardcoded into the frontend.

---

### Condition Awareness

The system includes condition-awareness functionality such as:

- Live alarm banners
- Visual alerts
- System condition indicators
- Alert-related dashboard information

---

### HMI Remote Control

Authorized users may interact with supported ATS controls through the application.

Planned HMI operations include:

- Changing the active source/input
- Changing input cost/day

HMI actions are access-controlled.

A user may have access to the HMI page without having permission to perform a specific action.

In that case, the unauthorized action must not be presented as an available action.

The frontend must never bypass backend or system-level authorization.

---

## Access Control

The application uses three related access concepts:

### Page Access

Controls whether a user can access an application page.

If the user does not have access:

- The navigation item is hidden.
- The route is protected.

### Action Access

Controls individual actions within an accessible page.

For example:

- A user may access HMI.
- The user may not have permission to change the active source.

The source-change action should therefore not be available to that user.

### Feature Access

Controls whether a particular feature or dashboard section is available.

If a user does not have access to a feature:

- The feature is not rendered.
- Feature-dependent data should not be unnecessarily requested.

If the feature is enabled for the user, the feature becomes available according to the applicable permissions.

---

## Admin Module

The application includes an administrative area for managing access.

Admin functionality is intended to include:

- User management
- Role management
- Permission management
- Feature management

Feature flags are managed through the Admin module.

Only authorized administrators should be able to manage feature availability.

UI visibility is not considered a security boundary. Authorization must also be enforced by the appropriate backend or application service.

---

## Technology Stack

### Frontend

| Tool | Status |
| --- | --- |
| React 19 | In use |
| Vite 8 | In use |
| JavaScript (no TypeScript) | In use |
| ESLint | Configured (`npm run lint`) |
| Tailwind CSS 4 | Configured via `@tailwindcss/vite` (`src/styles/index.css`) |
| React Router 7 | Configured (`src/routes/router.js`) |

### Animation

The planned animation approach is:

- `thinking-orbs` for meaningful processing/loading states (installed, not yet used)
- Transitions.dev patterns for reusable interface transitions
- Custom animation for the ATS power-flow visualization

Animations should support system understanding rather than become decoration for its own sake.

The interface must also respect reduced-motion preferences.

---

## Data and Integration Architecture

The application follows this general data boundary:

```text
User Interface
      ↓
Hooks / Feature Logic
      ↓
Application Services
      ↓
Integration Adapter
      ↓
Existing ATS / Node-RED System
```

---

## Development Setup

### Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8)
- npm

### Install

```bash
npm ci
```

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

Manual flow tests are documented in [`docs/SmokeTest.md`](docs/SmokeTest.md).

### Data source

`VITE_DATA_SOURCE` selects the integration adapter:

| Value | Behavior |
| --- | --- |
| `mock` | Development/demo data. A "Mock data" badge is always shown. |
| `live` | Production integration adapter. **Not implemented yet** — the transport is TBD, so the app shows "not configured" states. |

When unset, `npm run dev` uses `mock` and production builds use `live`, so a production build never silently shows mock data. To build a demo with mock data, set `VITE_DATA_SOURCE=mock` explicitly.

Live Node-RED integration is not implemented. The application must not be pointed at production devices.

---

## Documentation

- Agent guidance (root [`CLAUDE.md`](CLAUDE.md) points here): [`docs/Agents/CLAUDE.md`](docs/Agents/CLAUDE.md), [`docs/Agents/10_AGENT_INSTRUCTIONS.md`](docs/Agents/10_AGENT_INSTRUCTIONS.md)
- Project documentation: [`docs/Project/`](docs/Project/)
- Repository structure (authoritative): [`docs/Project/10_REPOSITORY_STRUCTURE.md`](docs/Project/10_REPOSITORY_STRUCTURE.md)
- Smoke tests: [`docs/SmokeTest.md`](docs/SmokeTest.md)
