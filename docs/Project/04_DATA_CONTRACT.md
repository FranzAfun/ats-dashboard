# 04 Data Contract

## 1. Purpose

This document defines the data structures that will be exchanged between
the existing ATS/Node-RED system and the custom web application.

The purpose is to give the frontend and integration layer a clear,
shared structure before production implementation begins.

The exact live field names and payloads are not yet confirmed.
Therefore, the structures below are the proposed application contract
and must be mapped to the actual Node-RED outputs during integration.

------------------------------------------------------------------------

## 2. Contract Principles

The data contract shall follow these rules:

1.  Production values must come from the approved integration layer.
2.  React components must consume structured data.
3.  Components must not contain hardcoded live telemetry.
4.  Mock data must follow the same contract as live data.
5.  Units must be explicit.
6.  Timestamps must be included for live telemetry where applicable.
7.  Missing values must be represented clearly.
8.  Frontend code must not depend directly on raw device protocols.

------------------------------------------------------------------------

# 3. Telemetry Contract

The general telemetry object should follow this structure:

``` json
{
  "timestamp": "2026-09-26T12:30:00Z",
  "source": "grid",
  "voltage": 230.4,
  "current": 12.8,
  "power": 2949.1,
  "energy": 42.71,
  "frequency": 50.0,
  "powerFactor": 0.96
}
```

### Notes

This is a proposed application-level structure.

The actual fields available for each source must be confirmed from the
existing PZEM/Node-RED data.

Do not assume that every source provides every field.

------------------------------------------------------------------------

# 4. Source Identifier

Source identifiers should use a consistent internal representation.

``` text
solar
grid
generator
```

Display labels may be different from internal identifiers.

Example:

``` json
{
  "id": "grid",
  "label": "Ghana Utility/Grid"
}
```

The frontend should use the identifier for application logic and the
label for presentation.

------------------------------------------------------------------------

# 5. Source Status Contract

The frontend requires a structured source-status object.

``` json
{
  "activeSource": "grid",
  "solar": {
    "available": true,
    "active": false
  },
  "grid": {
    "available": true,
    "active": true
  },
  "generator": {
    "available": true,
    "active": false
  }
}
```

The exact meaning of `available` must be defined by the source system.

The frontend must not infer availability from unrelated telemetry.

------------------------------------------------------------------------

# 6. ATS Status Contract

A proposed ATS status structure:

``` json
{
  "state": "grid",
  "transitioning": false,
  "lastTransition": {
    "from": "solar",
    "to": "grid",
    "timestamp": "2026-09-26T12:25:00Z"
  }
}
```

Possible states must be confirmed against the existing Node-RED logic.

------------------------------------------------------------------------

# 7. Temperature Contract

Temperature data should be represented separately from electrical
telemetry when appropriate.

``` json
{
  "timestamp": "2026-09-26T12:30:00Z",
  "value": 42.7,
  "unit": "°C",
  "status": "normal"
}
```

The exact Modbus register, scaling, and source identifier are not yet
defined in this contract.

------------------------------------------------------------------------

# 8. Tariff Contract

The tariff object should provide the information required by the Home
and Financial sections.

``` json
{
  "source": "grid",
  "rate": 1.85,
  "currency": "GHS",
  "unit": "kWh",
  "timestamp": "2026-09-26T12:30:00Z"
}
```

The actual currency, rate source, billing rules, and update mechanism
must follow the existing system configuration.

------------------------------------------------------------------------

# 9. Energy and Cost Contract

A proposed source financial object:

``` json
{
  "source": "grid",
  "energy": 42.71,
  "energyUnit": "kWh",
  "cost": 78.99,
  "currency": "GHS",
  "period": "daily"
}
```

Supported periods are expected to include:

``` text
daily
monthly
yearly
```

The exact calculation and persistence mechanism must be confirmed.

------------------------------------------------------------------------

# 10. Source Usage Contract

The application needs source usage percentages.

``` json
{
  "period": "daily",
  "solar": 35.2,
  "grid": 48.6,
  "generator": 16.2
}
```

Percentages should be represented as numeric values.

The existing Node-RED system already calculates source runtime and usage
percentages from source/contactor states. The frontend should consume
those calculated values rather than independently recreating the
calculation.

------------------------------------------------------------------------

# 11. ATS Transition Metrics Contract

A proposed transition object:

``` json
{
  "totalTransitions": 14,
  "deadTimeMs": 820,
  "lastSwitchTimeMs": 1450,
  "interlockViolation": false,
  "prolongedOutage": false
}
```

Event history may use:

``` json
{
  "timestamp": "2026-09-26T12:25:00Z",
  "from": "solar",
  "to": "grid",
  "deadTimeMs": 820,
  "switchTimeMs": 1450,
  "status": "completed"
}
```

Field names and exact units must match the final integration output.

------------------------------------------------------------------------

# 12. Alarm Contract

The application should receive structured alarm information.

``` json
{
  "id": "temperature_high",
  "severity": "warning",
  "title": "High Temperature",
  "message": "Temperature is above the configured threshold.",
  "active": true,
  "timestamp": "2026-09-26T12:30:00Z"
}
```

Possible severity values:

``` text
info
warning
critical
```

These values are proposed and must be aligned with the actual alarm
system.

The frontend must not invent alarm conditions.

------------------------------------------------------------------------

# 13. HMI Command Contract

Remote controls require a clear command structure.

### Change Source

Proposed request:

``` json
{
  "command": "change_source",
  "targetSource": "grid",
  "requestId": "unique-request-id",
  "timestamp": "2026-09-26T12:30:00Z"
}
```

### Change Input Cost/Day

Proposed request:

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

These are application-level proposals only.

The actual Node-RED command format must be confirmed before
implementation.

------------------------------------------------------------------------

# 14. Command Response Contract

A control command should return an explicit status.

``` json
{
  "requestId": "unique-request-id",
  "status": "accepted",
  "message": "Command accepted.",
  "timestamp": "2026-09-26T12:30:02Z"
}
```

Possible statuses:

``` text
pending
accepted
rejected
failed
applied
```

The final list must match the actual control system.

------------------------------------------------------------------------

# 15. Dashboard Summary Contract

The frontend may use a consolidated dashboard object to simplify page
rendering.

``` json
{
  "timestamp": "2026-09-26T12:30:00Z",
  "activeSource": "grid",
  "tariff": {
    "rate": 1.85,
    "currency": "GHS",
    "unit": "kWh"
  },
  "temperature": {
    "value": 42.7,
    "unit": "°C"
  },
  "sources": {
    "solar": {},
    "grid": {},
    "generator": {}
  },
  "alarms": [],
  "transitionMetrics": {}
}
```

This object is an application convenience layer and does not mean
Node-RED must produce one identical object.

An integration adapter may transform the existing Node-RED outputs into
this structure.

------------------------------------------------------------------------

# 16. Historical Analytics Contract

Historical chart data should use a consistent time-series structure.

``` json
{
  "timestamp": "2026-09-26T12:00:00Z",
  "value": 78.99
}
```

A chart dataset may then contain:

``` json
[
  {
    "timestamp": "2026-09-24T12:00:00Z",
    "value": 70.20
  },
  {
    "timestamp": "2026-09-25T12:00:00Z",
    "value": 75.40
  },
  {
    "timestamp": "2026-09-26T12:00:00Z",
    "value": 78.99
  }
]
```

The exact aggregation period depends on the selected chart:

-   Daily
-   Monthly
-   Yearly

------------------------------------------------------------------------

# 17. Data Freshness

Live telemetry must include enough information to determine whether it
is current.

Recommended:

``` json
{
  "timestamp": "2026-09-26T12:30:00Z"
}
```

The frontend should be able to distinguish:

``` text
LIVE
STALE
DISCONNECTED
```

The exact stale-data threshold must be defined during integration.

------------------------------------------------------------------------

# 18. Null and Missing Values

Missing telemetry must not be silently converted into zero.

For example:

``` json
{
  "powerFactor": null
}
```

means the value is unavailable.

This is different from:

``` json
{
  "powerFactor": 0
}
```

which represents an actual numeric value.

The frontend must handle unavailable fields gracefully.

------------------------------------------------------------------------

# 19. Units

Every measurement must have a known unit.

Common examples include:

  Measurement    Expected Unit
  -------------- ---------------
  Voltage        V
  Current        A
  Power          W or kW
  Energy         Wh or kWh
  Frequency      Hz
  Power Factor   ratio
  Temperature    °C
  Cost           GHS
  Tariff         GHS/kWh

These are expected application units, not assumptions about the raw
device payload.

The integration layer must perform any required conversion.

------------------------------------------------------------------------

# 20. Type Safety

The frontend should define TypeScript types/interfaces for the data
contract.

Example:

``` ts
export interface Telemetry {
  timestamp: string;
  source: SourceId;
  voltage?: number | null;
  current?: number | null;
  power?: number | null;
  energy?: number | null;
  frequency?: number | null;
  powerFactor?: number | null;
}
```

Example:

``` ts
export type SourceId = "solar" | "grid" | "generator";
```

The final interfaces shall be updated once the actual integration
payloads are confirmed.

------------------------------------------------------------------------

# 21. Mock Data Contract

Mock data must use the same structures as live data.

Example:

``` text
Live data
    ↓
Integration adapter
    ↓
Application contract
    ↓
React components

Mock data
    ↓
Mock adapter
    ↓
Application contract
    ↓
React components
```

This allows the UI to be developed before live integration is complete
without creating a second incompatible data structure.

------------------------------------------------------------------------

# 22. Raw vs Application Data

The frontend should not depend on raw:

-   Modbus register values
-   MQTT topic names
-   Device-specific payload formats
-   PLC-specific structures

Instead:

``` text
Raw Device Data
       ↓
Node-RED / Integration Adapter
       ↓
Application Data Contract
       ↓
React
```

This keeps the frontend independent from hardware-specific
implementation details.

------------------------------------------------------------------------

# 23. Contract Validation

Before production integration is marked complete, the following must be
verified:

-   Actual Node-RED payloads
-   Actual MQTT payloads
-   Actual Modbus-derived values
-   Actual source identifiers
-   Actual units
-   Actual timestamps
-   Actual command payloads
-   Actual command responses
-   Actual alarm structure
-   Actual historical data structure

Any field that cannot be verified must remain explicitly marked as
unconfirmed.

------------------------------------------------------------------------

# 24. Current Contract Status

### Confirmed

-   Source categories
-   Modbus TCP role
-   MQTT role for PZEM-004T
-   Node-RED as the processing/control layer
-   Required frontend information areas

### Proposed

-   Application-level JSON structures
-   TypeScript interfaces
-   Command request/response shapes
-   Alarm structure
-   Historical chart structure
-   Freshness states

### Not Yet Confirmed

-   Exact live payloads
-   Exact MQTT topics
-   Exact MQTT payloads
-   Exact Modbus mapping
-   Exact frontend integration mechanism
-   Exact command interface
-   Authentication/authorization payloads
-   Historical storage/API

------------------------------------------------------------------------

# 25. Implementation Rule

Do not treat the proposed structures in this document as confirmed
device payloads.

The application contract is the interface we want the frontend to
consume.

The integration layer is responsible for adapting the real
Node-RED/system data into this contract.

The next documentation should define the React frontend architecture
around this contract.
