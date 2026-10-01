# 07 Integration Plan

## 1. Purpose

This document defines how the custom ATS web application will integrate
with the existing Node-RED/ATS system.

The goal is to establish a clean boundary between:

-   The physical ATS system
-   Device communication
-   Node-RED processing and control
-   The application integration layer
-   The React frontend
-   Authentication and access control

The exact frontend transport is not yet confirmed. Therefore, this
document defines the integration requirements and decision process
without assuming a final protocol.

------------------------------------------------------------------------

# 2. Integration Principle

The custom application should extend the existing system rather than
replace working ATS control logic.

The preferred architecture is:

``` text
Physical ATS / Devices
        ↓
Modbus TCP / MQTT
        ↓
Node-RED
        ↓
Application Integration Interface
        ↓
Access / Authorization Boundary
        ↓
React + Vite + JavaScript + Tailwind
```

The frontend should not communicate directly with the physical devices.

------------------------------------------------------------------------

# 3. Existing Communication Paths

The confirmed communication paths are:

### Modbus TCP

Used for:

-   Temperature
-   Contactor coil status

### MQTT

Used for:

-   PZEM-004T electrical sensor data

### Node-RED

Responsible for:

-   Processing incoming data
-   Existing ATS logic
-   Source monitoring
-   Source usage calculations
-   Tariff monitoring
-   Transition metrics
-   Existing control logic
-   Existing dashboard-related processing

The supplied `ATS.json` contains a WebSocket telemetry section, but the
project owner has confirmed that `/ws/telemetry` is not the intended
frontend integration method.

Therefore, `/ws/telemetry` shall not be treated as the production
frontend interface unless explicitly re-approved.

------------------------------------------------------------------------

# 4. Integration Ownership

## Existing ATS / Node-RED Side

The existing system owns:

-   Device communication
-   Modbus TCP
-   MQTT/PZEM integration
-   ATS switching logic
-   Source state
-   Existing calculations
-   Existing alarm logic
-   Control execution

## Custom Application Side

The custom application owns:

-   User interface
-   Visualization
-   Access-aware presentation
-   Analytics presentation
-   HMI interface
-   User interactions
-   Data export interface
-   Frontend validation
-   Connection/error presentation

## Shared Boundary

Both sides must agree on:

-   Telemetry contract
-   Command contract
-   Alarm contract
-   Financial data contract
-   Historical data contract
-   Authentication/access behavior
-   Connection behavior
-   Error behavior

------------------------------------------------------------------------

# 5. Application Integration Layer

The frontend should not be tightly coupled to the raw Node-RED flow
structure.

Instead, the application should use an integration layer:

``` text
Node-RED Output
      ↓
Integration Adapter
      ↓
Application Data Contract
      ↓
Frontend Services
      ↓
React Components
```

This protects the frontend from changes in:

-   MQTT payloads
-   Modbus-derived values
-   Node-RED flow structure
-   Device-specific field names
-   Transport protocol

------------------------------------------------------------------------

# 6. Transport Decision

The final frontend transport must be selected based on the actual
interface exposed by the existing system.

Possible approaches include:

-   HTTP/REST
-   WebSocket
-   Server-Sent Events
-   Another explicitly supported application interface

The project must not choose a transport simply because it is present
somewhere in `ATS.json`.

------------------------------------------------------------------------

# 7. Transport Requirements

Whatever transport is selected must support the application's actual
needs.

### Telemetry

The interface should support:

-   Current telemetry
-   Source status
-   Temperature
-   Tariff
-   Alerts
-   ATS state
-   Financial values where available

### Commands

The interface should support authorized commands such as:

-   Change source/input
-   Change input cost/day

### Status

The interface should provide enough information for the frontend to
determine:

-   Connected
-   Connecting
-   Disconnected
-   Stale
-   Error

------------------------------------------------------------------------

# 8. Recommended Integration Abstraction

The frontend should expose services rather than protocol-specific code.

Example:

``` text
src/
└── services/
    ├── telemetry.service.js
    ├── control.service.js
    ├── analytics.service.js
    ├── alerts.service.js
    ├── auth.service.js
    ├── access.service.js
    └── export.service.js
```

Example:

``` js
const telemetry = await telemetryService.getDashboardTelemetry();
```

The component should not care whether the service internally uses:

``` text
HTTP
WebSocket
SSE
```

------------------------------------------------------------------------

# 9. Telemetry Flow

The intended conceptual flow is:

``` text
PZEM-004T
    ↓
MQTT
    ↓
Node-RED
    ↓
Telemetry Adapter
    ↓
Application Telemetry Contract
    ↓
Frontend Service
    ↓
React
```

For Modbus-derived information:

``` text
Device / PLC
    ↓
Modbus TCP
    ↓
Node-RED
    ↓
Telemetry Adapter
    ↓
Application Telemetry Contract
    ↓
Frontend
```

The frontend should receive application-level data rather than raw
protocol messages.

------------------------------------------------------------------------

# 10. Telemetry Frequency

The actual telemetry update frequency must be confirmed.

The application must not assume that all data updates at the same
interval.

Different data types may have different update requirements:

``` text
Live electrical telemetry
Temperature
Source state
Tariff
Alerts
Historical analytics
```

The final integration contract must document expected update behavior
for each category.

------------------------------------------------------------------------

# 11. Data Freshness

Every live telemetry object should provide a timestamp or equivalent
freshness information.

Example:

``` json
{
  "timestamp": "2026-09-26T12:30:00Z",
  "source": "grid",
  "power": 2949.1
}
```

The frontend should use this information to distinguish current data
from stale data.

The stale-data threshold must be agreed upon during integration.

------------------------------------------------------------------------

# 12. Command Flow

HMI commands shall follow this pattern:

``` text
User
 ↓
React UI
 ↓
Access Check
 ↓
Input Validation
 ↓
Confirmation if required
 ↓
Control Service
 ↓
Application Integration Interface
 ↓
Node-RED
 ↓
ATS Control Logic
 ↓
Command Result
 ↓
React UI
```

The frontend must not directly manipulate the ATS device.

------------------------------------------------------------------------

# 13. Source Change Command

The source-change operation requires an explicit command contract.

Conceptually:

``` json
{
  "command": "change_source",
  "targetSource": "grid",
  "requestId": "unique-request-id",
  "timestamp": "2026-09-26T12:30:00Z"
}
```

This is a proposed application-level structure.

The actual Node-RED command format must be confirmed before
implementation.

------------------------------------------------------------------------

# 14. Cost Change Command

The cost/day operation requires an explicit command contract.

Conceptually:

``` json
{
  "command": "update_input_cost",
  "source": "grid",
  "value": 1.85,
  "currency": "GHS",
  "period": "day",
  "requestId": "unique-request-id",
  "timestamp": "2026-09-26T12:30:00Z"
}
```

The actual command format and validation rules must be confirmed.

------------------------------------------------------------------------

# 15. Command Response

Commands should return explicit results.

Example:

``` json
{
  "requestId": "unique-request-id",
  "status": "accepted",
  "message": "Command accepted.",
  "timestamp": "2026-09-26T12:30:02Z"
}
```

Possible states:

``` text
pending
accepted
rejected
failed
applied
```

The final status model must match the actual control system.

------------------------------------------------------------------------

# 16. Access Control Integration

Authentication and authorization must be integrated into the application
boundary.

The frontend may receive an effective-access object such as:

``` json
{
  "user": {
    "id": "user-id",
    "role": "operator"
  },
  "permissions": [
    "dashboard.view",
    "power.view",
    "hmi.view",
    "hmi.changeSource"
  ],
  "features": [
    "powerMonitoring",
    "hmi"
  ]
}
```

This is an application-level proposal.

The actual authentication provider and access implementation are still
to be selected.

------------------------------------------------------------------------

# 17. Authorization Requirements

The integration layer must not rely solely on frontend visibility.

For sensitive operations:

``` text
Frontend hides button
        ↓
User sends request anyway
        ↓
Protected integration layer
        ↓
Authorization check
        ↓
Allow or reject
```

This is required for:

-   HMI source changes
-   Cost changes
-   User management
-   Feature management
-   Permission management
-   Restricted data
-   Sensitive exports

------------------------------------------------------------------------

# 18. Feature-Aware Data Requests

The application should avoid requesting data for features the user
cannot access when practical.

Example:

``` text
User lacks financialAnalytics
        ↓
No financial dashboard section
        ↓
No unnecessary financial data request
```

This reduces unnecessary data transfer and keeps feature boundaries
cleaner.

The server/integration layer must still enforce data authorization.

------------------------------------------------------------------------

# 19. Error Handling

The integration layer should normalize errors into application-level
states.

Possible categories:

``` text
NETWORK_ERROR
AUTH_ERROR
FORBIDDEN
INVALID_DATA
TIMEOUT
DEVICE_ERROR
NODE_RED_ERROR
COMMAND_REJECTED
COMMAND_FAILED
```

The frontend should not need to understand raw device or protocol
errors.

------------------------------------------------------------------------

# 20. Connection Management

The application should maintain a connection state.

Conceptual states:

``` text
CONNECTING
CONNECTED
STALE
DISCONNECTED
ERROR
```

The frontend should communicate connection problems clearly without
pretending that the last received value is live.

------------------------------------------------------------------------

# 21. Retry Strategy

Retry behavior should be defined according to the final transport.

General principle:

-   Retry transient connection failures
-   Avoid aggressive infinite retries
-   Do not repeatedly submit control commands automatically
-   Do not automatically repeat potentially dangerous HMI commands
-   Surface persistent failures to the user

------------------------------------------------------------------------

# 22. Mock Integration

Frontend development should begin with a mock integration layer when
live integration is unavailable.

Example:

``` text
React
  ↓
Telemetry Service
  ↓
Mock Adapter
  ↓
Mock Data
```

Later:

``` text
React
  ↓
Telemetry Service
  ↓
Live Adapter
  ↓
Confirmed Node-RED Interface
```

The React components should not need to be rewritten when switching from
mock to live integration.

------------------------------------------------------------------------

# 23. Development Sequence

Integration should be implemented in stages.

### Stage 1: Contract

Confirm:

-   Telemetry fields
-   Units
-   Timestamps
-   Source identifiers
-   Alarm structure
-   Financial structures
-   Command structures

### Stage 2: Transport

Confirm:

-   Integration protocol
-   Endpoint/topic/interface
-   Authentication
-   Connection behavior

### Stage 3: Read-Only Telemetry

Implement:

-   Dashboard telemetry
-   Source status
-   Temperature
-   Power parameters
-   Alerts

### Stage 4: Analytics

Implement:

-   Source usage
-   Cost data
-   Trends
-   Transition metrics
-   Data export

### Stage 5: HMI Commands

Implement:

-   Source switching
-   Cost/day update
-   Command feedback
-   Failure handling

### Stage 6: Production Security

Finalize:

-   Authentication
-   Authorization
-   Feature flags
-   Audit requirements
-   Secrets
-   Production configuration

------------------------------------------------------------------------

# 24. Integration Testing

Before production use, test:

### Telemetry

-   Correct values
-   Correct units
-   Correct timestamps
-   Missing values
-   Stale values
-   Disconnects

### Source State

-   Solar active
-   Grid active
-   Generator active
-   Source transitions
-   Unavailable source

### HMI

-   Authorized source change
-   Unauthorized source change
-   Invalid source
-   Command timeout
-   Command rejection
-   Command failure
-   Successful application

### Feature Access

-   Restricted navigation
-   Restricted Dashboard sections
-   Restricted actions
-   Restricted data
-   Admin feature management

------------------------------------------------------------------------

# 25. No Direct Device Access From React

The frontend must not implement:

``` text
React → Modbus
React → PLC
React → PZEM
React → Raw MQTT
```

The preferred model is:

``` text
Devices
  ↓
Existing Communication
  ↓
Node-RED
  ↓
Application Integration
  ↓
React
```

This keeps hardware and frontend responsibilities separated.

------------------------------------------------------------------------

# 26. Integration Documentation Required From Existing System

Before production integration, the following information must be
collected from the existing ATS/Node-RED implementation:

### Modbus

-   Device/IP information where appropriate
-   Register addresses
-   Register meanings
-   Data types
-   Scaling
-   Units

### MQTT/PZEM

-   Broker
-   Topics
-   Payload examples
-   QoS
-   Retained-message behavior
-   Update frequency

### Node-RED

-   Exposed outputs
-   Command inputs
-   Message formats
-   Error behavior
-   Existing state calculations

### Financial Logic

-   Tariff sources
-   Cost calculations
-   Reset behavior
-   Historical requirements

### HMI

-   Supported commands
-   Validation rules
-   Safety rules
-   Command responses

------------------------------------------------------------------------

# 27. Integration Ownership Boundary

The project should maintain a clear boundary:

``` text
Existing ATS System
        │
        │ Confirmed Interface
        ▼
Application Integration Layer
        │
        │ Application Contract
        ▼
React Frontend
```

Changes inside Node-RED should not automatically require changes
throughout the React application if the application contract remains
stable.

------------------------------------------------------------------------

# 28. Current Integration Status

### Confirmed

-   Node-RED is the existing processing/control layer.
-   Modbus TCP provides temperature and contactor coil status.
-   MQTT is used for PZEM-004T sensors.
-   `/ws/telemetry` is not the confirmed frontend integration method.
-   React will not directly communicate with physical devices.
-   HMI controls require an explicit command interface.
-   Access control must apply to sensitive data and commands.

### Not Yet Confirmed

-   Frontend transport
-   Integration endpoint/interface
-   Telemetry payloads
-   Command payloads
-   Authentication mechanism
-   Authorization implementation
-   MQTT broker details
-   MQTT topics
-   Modbus register documentation
-   Historical data interface
-   Exact financial data interface

------------------------------------------------------------------------

# 29. Integration Completion Criteria

The integration is ready for production implementation when:

-   The transport is confirmed.
-   Telemetry payloads are documented.
-   Command payloads are documented.
-   Error behavior is documented.
-   Authentication is defined.
-   Authorization is defined.
-   Feature-aware access is defined.
-   Data freshness behavior is defined.
-   Mock and live adapters use the same application contract.
-   Read-only telemetry has been tested.
-   HMI commands have been tested safely.
-   No frontend component depends directly on device protocols.

The next documentation should define the development roadmap and
implementation order.
