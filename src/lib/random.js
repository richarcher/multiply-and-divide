/** Inclusive random integer in [min, max]. */
export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}
