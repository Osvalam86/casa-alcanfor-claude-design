/** Ancho del contenedor de página (max-w-page con px-gutter): min(100vw, 1280px) − 2 × clamp(20px, 4vw, 48px). */
export const pageContent = (vw: number) => Math.min(vw, 1280) - 2 * Math.min(48, Math.max(20, vw * 0.04))

/** Columnas de grid-fill-* / grid-fit-* (repeat(auto-*, minmax(min(100%, min), 1fr))) y ancho de cada una. */
export function autoGrid(content: number, min: number, gap: number) {
  const cols = Math.max(1, Math.floor((content + gap) / (min + gap)))
  return { cols, col: (content - gap * (cols - 1)) / cols }
}

/**
 * Genera un atributo sizes a partir de una función "ancho de viewport → ancho CSS que se pinta".
 * Recorre los viewports de `from` a `to` px; abre una franja nueva cuando el ancho dentro de la franja
 * varía más que `tolerance` y usa el máximo de cada una: nunca pide de menos y, como mucho, un
 * `tolerance − 1` de más. Para rejillas auto-fill/auto-fit donde el ancho salta al cambiar las columnas.
 */
export function sizesFromWidths(painted: (vw: number) => number, from = 320, to = 1445, tolerance = 1.2) {
  const bands: { min: number; px: number }[] = []
  let start = from
  let lo = painted(from)
  let hi = lo
  for (let vw = from + 1; vw <= to + 1; vw++) {
    const w = vw <= to ? painted(vw) : NaN
    const nextLo = Math.min(lo, w)
    const nextHi = Math.max(hi, w)
    if (vw > to || nextHi / nextLo > tolerance) {
      bands.push({ min: start, px: Math.ceil(hi) })
      start = vw
      lo = w
      hi = w
    } else {
      lo = nextLo
      hi = nextHi
    }
  }
  // De mayor a menor: el navegador usa la primera condición que cumple; la primera franja no lleva media
  return bands
    .reverse()
    .map(({ min, px }, i, all) => (i === all.length - 1 ? `${px}px` : `(min-width: ${min}px) ${px}px`))
    .join(', ')
}
