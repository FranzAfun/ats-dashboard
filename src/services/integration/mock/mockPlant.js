import { mockActiveAlarms, mockAlarmHistory } from '../../../data/mock/alarms.mock.js'
import { mockPlant } from '../../../data/mock/plant.mock.js'
import { ErrorCode, IntegrationError } from '../errors.js'
import { scenarioStore } from './mockScenario.js'

const SOURCE_IDS = ['solar', 'grid', 'generator']
const CONNECT_DELAY_MS = 500

const round = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits

function wobble(seconds, period, amplitude) {
  return Math.sin((seconds / period) * Math.PI * 2) * amplitude
}

/**
 * Simulated ATS plant for mock mode. It produces data in the application
 * contract shape only; it does not model any real device protocol.
 */
export function createMockPlant() {
  const state = {
    activeSource: mockPlant.initialActiveSource,
    availability: { ...mockPlant.availability },
    transitioning: false,
    lastTransition: {
      from: 'solar',
      to: mockPlant.initialActiveSource,
      timestamp: new Date(Date.now() - 3 * 3600_000).toISOString(),
    },
    energy: { ...mockPlant.initialEnergyKwh },
    inputCostPerDay: { ...mockPlant.inputCostPerDay },
    transitions: [],
    totalTransitions: 14,
    lastSwitchTimeMs: 1450,
    lastDeadTimeMs: 820,
    connection: 'connecting',
    lastStatus: null,
    lastPower: null,
    lastTickAt: Date.now(),
  }

  const channels = {
    status: new Set(),
    power: new Set(),
    alarms: new Set(),
    control: new Set(),
    connection: new Set(),
  }

  let timer = null
  let connectTimer = null

  const scenario = () => scenarioStore.get()

  function subscriberCount() {
    return (
      channels.status.size +
      channels.power.size +
      channels.alarms.size +
      channels.control.size +
      channels.connection.size
    )
  }

  function setConnection(next) {
    if (state.connection === next) return
    state.connection = next
    for (const listener of channels.connection) listener(next)
  }

  function integrationError() {
    return new IntegrationError(
      ErrorCode.NODE_RED_ERROR,
      'Mock scenario: the integration reported an error.',
    )
  }

  function buildPower(now) {
    const seconds = now / 1000
    const empty = scenario() === 'empty'
    const timestamp = new Date(now).toISOString()
    const loadPower = state.transitioning
      ? 0
      : mockPlant.load.basePowerW +
        wobble(seconds, 90, mockPlant.load.swingW) +
        wobble(seconds, 7, 60)

    const sources = {}
    for (const id of SOURCE_IDS) {
      const nominal = mockPlant.nominal[id]
      const available = state.availability[id]
      const supplying = available && id === state.activeSource && !state.transitioning
      const voltage = available ? nominal.voltage + wobble(seconds + id.length, 23, 1.5) : 0
      const power = supplying ? loadPower : 0
      const pf = nominal.powerFactor
      sources[id] = {
        source: id,
        timestamp,
        voltage: round(voltage, 1),
        current: voltage > 0 ? round(power / (voltage * pf), 2) : 0,
        power: round(power, 1),
        energy: round(state.energy[id], 2),
        frequency: available ? round(nominal.frequency + wobble(seconds, 31, 0.03), 2) : 0,
        powerFactor: supplying ? pf : null,
      }
    }

    const activeNominal = mockPlant.nominal[state.activeSource]
    const loadVoltage = state.transitioning ? 0 : sources[state.activeSource].voltage
    const load = {
      timestamp,
      voltage: loadVoltage,
      current: loadVoltage > 0 ? round(loadPower / (loadVoltage * activeNominal.powerFactor), 2) : 0,
      power: round(loadPower, 1),
      energy: round(state.energy.load, 2),
      frequency: state.transitioning ? 0 : sources[state.activeSource].frequency,
      powerFactor: state.transitioning ? null : activeNominal.powerFactor,
    }

    if (empty) {
      // Missing fields stay null; they are never shown as zero.
      for (const id of ['generator']) {
        for (const key of ['voltage', 'current', 'power', 'energy', 'frequency', 'powerFactor']) {
          sources[id][key] = null
        }
      }
      load.powerFactor = null
      load.energy = null
    }

    return { timestamp, sources, load }
  }

  function buildStatus(now) {
    const timestamp = new Date(now).toISOString()
    const empty = scenario() === 'empty'
    const alarm = scenario() === 'alarm'
    const sourceStatus = {}
    for (const id of SOURCE_IDS) {
      sourceStatus[id] = {
        available: state.availability[id],
        active: id === state.activeSource && !state.transitioning,
      }
    }
    const temperatureValue = alarm
      ? mockPlant.temperature.alarmC + wobble(now / 1000, 20, 0.6)
      : mockPlant.temperature.normalC + wobble(now / 1000, 120, 1.2)

    return {
      timestamp,
      activeSource: state.activeSource,
      sourceStatus,
      ats: {
        state: state.transitioning ? 'transitioning' : state.activeSource,
        transitioning: state.transitioning,
        lastTransition: state.lastTransition,
      },
      tariff: empty
        ? null
        : {
            source: state.activeSource,
            rate: mockPlant.tariffs[state.activeSource],
            currency: mockPlant.currency,
            unit: 'kWh',
            timestamp,
          },
      temperature: empty
        ? null
        : {
            timestamp,
            value: round(temperatureValue, 1),
            unit: mockPlant.temperature.unit,
            status: alarm ? 'warning' : 'normal',
          },
    }
  }

  function buildAlarms(now) {
    if (scenario() === 'empty') return []
    const active =
      scenario() === 'alarm'
        ? mockActiveAlarms.map((alarm, index) => ({
            ...alarm,
            active: true,
            timestamp: new Date(now - (index + 1) * 4 * 60_000).toISOString(),
          }))
        : []
    const history = mockAlarmHistory.map(({ hoursAgo, ...alarm }) => ({
      ...alarm,
      active: false,
      timestamp: new Date(now - hoursAgo * 3600_000).toISOString(),
    }))
    return [...active, ...history]
  }

  function buildControlState(now) {
    const inputCostPerDay = {}
    for (const id of SOURCE_IDS) {
      inputCostPerDay[id] = {
        value: state.inputCostPerDay[id],
        currency: mockPlant.currency,
        period: 'day',
      }
    }
    return { timestamp: new Date(now).toISOString(), inputCostPerDay }
  }

  function accumulateEnergy(now) {
    const hours = (now - state.lastTickAt) / 3600_000
    state.lastTickAt = now
    if (state.transitioning || !state.lastPower) return
    const kwh = (state.lastPower.load.power ?? 0) * hours / 1000
    state.energy[state.activeSource] += kwh
    state.energy.load += kwh
  }

  function emit(channel, value) {
    for (const { onData } of channels[channel]) onData(value)
  }

  function emitError(error) {
    for (const channel of ['status', 'power', 'alarms', 'control']) {
      for (const { onError } of channels[channel]) onError?.(error)
    }
  }

  /** Publishes current data according to the active scenario. */
  function publish() {
    const current = scenario()
    if (current === 'disconnected') {
      setConnection('disconnected')
      return
    }
    if (current === 'error') {
      setConnection('error')
      emitError(integrationError())
      return
    }
    if (state.connection !== 'connected') return
    if (current === 'stale') {
      // Connection reported as up, but no new data arrives.
      if (state.lastStatus) emit('status', state.lastStatus)
      if (state.lastPower) emit('power', state.lastPower)
      return
    }

    const now = Date.now()
    accumulateEnergy(now)
    state.lastPower = buildPower(now)
    state.lastStatus = buildStatus(now)
    emit('power', state.lastPower)
    emit('status', state.lastStatus)
    emit('alarms', buildAlarms(now))
    emit('control', buildControlState(now))
  }

  function start() {
    if (timer) return
    setConnection('connecting')
    connectTimer = setTimeout(() => {
      if (!['disconnected', 'error'].includes(scenario())) setConnection('connected')
      publish()
    }, CONNECT_DELAY_MS)
    timer = setInterval(publish, mockPlant.tickMs)
  }

  function stop() {
    clearInterval(timer)
    clearTimeout(connectTimer)
    timer = null
    state.connection = 'connecting'
  }

  scenarioStore.subscribe(() => {
    if (!timer) return
    if (['disconnected', 'error'].includes(scenario())) {
      publish()
      return
    }
    if (state.connection !== 'connected') {
      setConnection('connecting')
      setTimeout(() => {
        setConnection('connected')
        publish()
      }, CONNECT_DELAY_MS)
      return
    }
    publish()
  })

  function subscribe(channel, onData, onError) {
    const entry = { onData, onError }
    channels[channel].add(entry)
    start()
    // Deliver the latest data immediately to late subscribers.
    if (state.connection === 'connected' && scenario() !== 'error') {
      const now = Date.now()
      if (channel === 'status' && state.lastStatus) onData(state.lastStatus)
      if (channel === 'power' && state.lastPower) onData(state.lastPower)
      if (channel === 'alarms') onData(buildAlarms(now))
      if (channel === 'control') onData(buildControlState(now))
    } else if (scenario() === 'error') {
      onError?.(integrationError())
    }
    return () => {
      channels[channel].delete(entry)
      if (subscriberCount() === 0) stop()
    }
  }

  return {
    subscribe,
    subscribeConnection(listener) {
      channels.connection.add(listener)
      start()
      return () => {
        channels.connection.delete(listener)
        if (subscriberCount() === 0) stop()
      }
    },
    getConnection: () => state.connection,
    getState: () => state,
    canChangeSource(target) {
      if (!SOURCE_IDS.includes(target)) return 'Unknown source.'
      if (state.transitioning) return 'A source transition is already in progress.'
      if (target === state.activeSource) return 'This source is already active.'
      if (!state.availability[target]) return 'The selected source is not available.'
      return null
    },
    beginTransition() {
      state.transitioning = true
      publish()
    },
    completeTransition(target) {
      const from = state.activeSource
      const timestamp = new Date().toISOString()
      state.activeSource = target
      state.transitioning = false
      state.lastTransition = { from, to: target, timestamp }
      state.totalTransitions += 1
      state.lastSwitchTimeMs = mockPlant.transitionDurationMs
      state.lastDeadTimeMs = 780 + Math.round(Math.random() * 120)
      state.transitions.unshift({
        timestamp,
        from,
        to: target,
        deadTimeMs: state.lastDeadTimeMs,
        switchTimeMs: state.lastSwitchTimeMs,
        status: 'completed',
      })
      publish()
    },
    abortTransition() {
      state.transitioning = false
      publish()
    },
    setInputCost(source, value) {
      state.inputCostPerDay[source] = value
      publish()
    },
  }
}
