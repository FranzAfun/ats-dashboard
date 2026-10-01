/**
 * MOCK alarms for development. Alarm identifiers are taken from the
 * documented examples (04_DATA_CONTRACT.md §11, §12). Production alarm
 * definitions and thresholds are TBD and come from the existing system.
 */
export const mockActiveAlarms = [
  {
    id: 'temperature_high',
    severity: 'warning',
    title: 'High Temperature',
    message: 'Temperature is above the configured threshold.',
  },
  {
    id: 'prolonged_outage',
    severity: 'critical',
    title: 'Prolonged Outage',
    message: 'A source outage has lasted longer than the configured limit.',
  },
]

export const mockAlarmHistory = [
  {
    id: 'interlock_violation',
    severity: 'critical',
    title: 'Interlock Violation',
    message: 'More than one source contactor was reported closed.',
    hoursAgo: 30,
  },
  {
    id: 'temperature_high',
    severity: 'warning',
    title: 'High Temperature',
    message: 'Temperature is above the configured threshold.',
    hoursAgo: 52,
  },
  {
    id: 'prolonged_outage',
    severity: 'critical',
    title: 'Prolonged Outage',
    message: 'A source outage has lasted longer than the configured limit.',
    hoursAgo: 96,
  },
]
