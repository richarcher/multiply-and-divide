let audioContext = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)()
  return audioContext
}

/**
 * Play a short success tone (correct).
 */
export function playCorrect() {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(523.25, ctx.currentTime)
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08)
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

/**
 * Play a short gentle "try again" tone (incorrect).
 */
export function playIncorrect() {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(392, ctx.currentTime)
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.25)
}

/**
 * Play a short fanfare for full marks (triumphant ascending notes).
 */
export function playFanfare() {
  const ctx = getContext()
  if (!ctx) return
  const notes = [523.25, 659.25, 783.99, 1046.5]
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2)

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.connect(gain)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const start = ctx.currentTime + i * 0.15
    osc.start(start)
    osc.stop(start + 0.4)
  })
}
