import { createLiveResource } from '../../lib/liveResource.js'
import { adapter } from '../integration/adapter.js'
import { validateAlarms } from '../integration/contract.js'

/** Active and cleared alarms supplied by the system. */
export const alarmsResource = createLiveResource(adapter.alerts.subscribeAlarms, validateAlarms)
