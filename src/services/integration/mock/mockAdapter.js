import { createMockAccess } from './mockAccess.js'

/**
 * Mock integration adapter for development and demonstration.
 * Implements the adapter interface documented in ../adapter.js using
 * clearly separated mock data from src/data/mock.
 */
export function createMockAdapter() {
  return {
    kind: 'mock',
    access: createMockAccess(),
  }
}
