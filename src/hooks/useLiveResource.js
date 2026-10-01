import { useSyncExternalStore } from 'react'

/** Subscribes a component to a shared live resource (lib/liveResource.js). */
export function useLiveResource(resource) {
  return useSyncExternalStore(resource.subscribe, resource.getSnapshot)
}
