import { useSyncExternalStore } from 'react'
import { adminService } from '../services/auth/adminService.js'
import { useAsyncData } from './useAsyncData.js'

/** Loads admin data and reloads it whenever access data changes. */
export function useAdminData(load, key) {
  const version = useSyncExternalStore(adminService.subscribeVersion, adminService.getVersion)
  return useAsyncData(load, `${key}:${version}`, { keepPrevious: true })
}
