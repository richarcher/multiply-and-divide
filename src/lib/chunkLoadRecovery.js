/**
 * Recover from stale cached chunks after deploy (ChunkLoadError / failed dynamic import).
 * If you add Vue Router with lazy routes, also call `isChunkLoadFailure` from `router.onError`
 * and reload when true.
 */
export function isChunkLoadFailure(err) {
  if (!err) return false
  const name = err.name || ''
  const msg = String(err.message || err)
  return (
    name === 'ChunkLoadError' ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module')
  )
}

export function installChunkLoadRecovery() {
  window.addEventListener('error', (event) => {
    if (isChunkLoadFailure(event.error)) {
      window.location.reload()
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadFailure(event.reason)) {
      event.preventDefault()
      window.location.reload()
    }
  })
}
