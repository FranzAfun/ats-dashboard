# ATS Energy Management Dashboard

## Project Overview

### 1. Project Purpose

This project is a custom web dashboard for an Automatic Transfer System
(ATS) and energy-management setup.

The system monitors and manages three main power sources:

-   Solar
-   Utility/Grid
-   Generator

The existing Node-RED system handles much of the industrial
communication, processing, switching logic, monitoring, and
energy-related calculations.

The custom web application will provide a cleaner and more modern
interface for viewing this information and interacting with supported
system controls.

------------------------------------------------------------------------

## 2. Existing System

The current system uses Node-RED as the main integration and processing
environment.

### Current communication sources

#### Modbus TCP

Used for:

-   Temperature data
-   Contactor coil/status information

#### MQTT

Used for:

-   PZEM-004T electrical sensor data

These data sources are processed by Node-RED.

### Existing Node-RED responsibilities

The provided ATS flow contains functionality related to:

-   Source usage tracking
-   Energy and cost calculations
-   Active source monitoring
-   Tariff monitoring
-   ATS transition metrics
-   Switch/event logging
-   Alarm conditions
-   Power-factor-related analysis
-   Dashboard data preparation
-   Reset and tracking functions

The supplied flow is not the complete system. The financial section and
some other parts are not included.

------------------------------------------------------------------------

## 3. Custom Dashboard Scope

The custom dashboard will cover the functions specified by the project
owner.

### Home Page

-   Live tariff
-   Temperature monitoring
-   System status indicators
-   HMI remote control
-   Animated power-flow diagram

### Power Parameters

-   Load telemetry
-   Generator telemetry
-   Grid telemetry
-   Solar telemetry

### Financial Analytics & Export

-   Source usage percentage
-   ATS transition metrics
-   Live tariff information
-   Active source
-   Energy consumption
-   Cost trend graphs
-   Daily cost information
-   Monthly cost information
-   Yearly cost information
-   Energy-source costs
-   Power-factor losses
-   Data export

### Early Condition Awareness

-   Live alarm banner
-   Visual alerts

------------------------------------------------------------------------

## 4. Dashboard Controls

The custom UI is not intended to be read-only.

The dashboard is expected to support controls for:

-   Changing the active power source/input
-   Manually changing input cost/tariff values

The exact command format and safety constraints will be defined from the
existing Node-RED implementation before these controls are connected.

------------------------------------------------------------------------

## 5. Frontend Direction

The frontend will use:

-   React
-   Vite
-   Tailwind CSS

Bootstrap will not be used.

The UI should be component-based, responsive, and designed specifically
for this system rather than based on the default Node-RED dashboard
appearance.

------------------------------------------------------------------------

## 6. Data and Integration Principle

The frontend should consume real system data through a defined
integration layer.

The application should not depend on manually hardcoded telemetry
values.

Development/demo values may be used only through a clearly separated
mock/demo data layer when required for UI development and testing.

Real device values, tariffs, statuses, measurements, and system states
should ultimately come from the actual system data source.

------------------------------------------------------------------------

## 7. Current Integration Architecture

The currently confirmed high-level data flow is:

``` text
Temperature / Contactor Data
          │
      Modbus TCP
          │
          ▼
      Node-RED
          ▲
          │
        MQTT
          │
     PZEM-004T
          │
          ▼
      Node-RED
          │
          ▼
   Custom Web Application
```

The exact frontend-to-Node-RED communication method has not yet been
finalized.

The existing `/ws/telemetry` WebSocket section found in the supplied ATS
flow is not currently confirmed as the intended integration method.

------------------------------------------------------------------------

## 8. Project Principle

The project will extend the existing system rather than unnecessarily
replacing working Node-RED logic.

Before implementing new backend services, the existing Node-RED flow and
available data interfaces will be inspected to determine what is already
handled and what is actually missing.

This prevents duplicated logic and unnecessary technologies.

------------------------------------------------------------------------

## 9. Current Status

### Confirmed

-   Node-RED is installed locally.
-   The ATS flow has been imported for inspection.
-   Modbus TCP is used for temperature and contactor status.
-   MQTT is used for PZEM-004T sensor data.
-   Node-RED handles significant processing and system logic.
-   A custom frontend is required.
-   React + Vite + Tailwind CSS will be used for the frontend.
-   The supplied ATS flow is incomplete.
-   Demo data exists for dashboard testing.

### Not yet finalized

-   Exact frontend-to-Node-RED communication method
-   Complete telemetry data contract
-   Exact command/control interface
-   Financial module integration
-   Historical-data storage requirements
-   Backend services beyond Node-RED, if any

These decisions will be made after inspecting the remaining system logic
and data interfaces.

------------------------------------------------------------------------

## 10. Documentation Rule

All implementation decisions should be documented before development
begins.

The project should favor:

-   Real data over hardcoded values
-   Reusable components
-   Configuration-driven values
-   Clear separation between UI, data access, and system logic
-   Minimal duplication
-   Existing system integration over unnecessary replacement
-   Tailwind CSS for styling
-   A clean and maintainable React architecture
