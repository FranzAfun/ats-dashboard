/**
 * MOCK plant parameters used to simulate telemetry during development.
 * These are demonstration values, NOT production telemetry, tariffs or
 * device states. Real values come from the ATS/Node-RED integration (TBD).
 */
export const mockPlant = {
  initialActiveSource: 'grid',
  availability: { solar: true, grid: true, generator: true },
  nominal: {
    solar: { voltage: 231, frequency: 50.0, powerFactor: 0.99 },
    grid: { voltage: 228, frequency: 49.98, powerFactor: 0.94 },
    generator: { voltage: 236, frequency: 50.3, powerFactor: 0.88 },
  },
  load: { basePowerW: 3200, swingW: 900 },
  temperature: { normalC: 38, alarmC: 71, unit: '°C' },
  // Demo tariffs in GHS/kWh. Production tariffs are TBD.
  tariffs: { solar: 0.45, grid: 1.85, generator: 4.2 },
  currency: 'GHS',
  // Demo input cost/day values. The production meaning is TBD.
  inputCostPerDay: { solar: 12.0, grid: 85.0, generator: 190.0 },
  initialEnergyKwh: { solar: 1820.4, grid: 4310.9, generator: 612.7, load: 6589.2 },
  tickMs: 2000,
  transitionDurationMs: 1600,
}
