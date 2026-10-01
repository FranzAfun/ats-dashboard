/** Simulated network latency so loading states are exercised in mock mode. */
export const MOCK_LATENCY_MS = 350

export function withLatency(produce, latency = MOCK_LATENCY_MS) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(produce())
      } catch (error) {
        reject(error)
      }
    }, latency)
  })
}
