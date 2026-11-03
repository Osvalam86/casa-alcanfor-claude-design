/**
 * Genera el favicon y los íconos de la app a partir del monograma del átomo Logo (arco + "CA").
 *   pnpm icons
 * Salida en public/: icon.svg, favicon.ico (32 px), apple-touch-icon.png (180 px), icon-192.png, icon-512.png.
 *
 * Sin dependencias nuevas: las letras salen como trazos del .woff de Cormorant Garamond 600 (el mismo que usa
 * el Logo; zlib de Node lo descomprime) para que icon.svg no dependa de fuentes instaladas, y los PNG se
 * rasterizan con el Chromium de Playwright. Los colores se leen de los primitivos de src/styles/theme.css.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'
import { chromium } from '@playwright/test'

const root = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

// ── Colores (primitivos de theme.css) ─────────────────────────────
const theme = readFileSync(root('src/styles/theme.css'), 'utf8')
const token = (name: string) => {
  const match = theme.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{3,8})`, 'i'))
  if (!match) throw new Error(`No se encontró --${name} en theme.css`)
  return match[1]
}
const SURFACE = token('ivory-50') // --color-surface
const ACCENT = token('gold-700') // --color-accent

// ── Lectura mínima de WOFF 1.0 con contornos TrueType (glyf) ─────
type Font = {
  unitsPerEm: number
  glyphIndex: (codePoint: number) => number
  advance: (glyph: number) => number
  path: (glyph: number, x: number, y: number, scale: number) => string
}

function readWoff(file: string): Font {
  const woff = readFileSync(file)
  if (woff.toString('latin1', 0, 4) !== 'wOFF') throw new Error(`${file} no es WOFF 1.0`)
  const tables = new Map<string, Buffer>()
  for (let i = 0, n = woff.readUInt16BE(12); i < n; i++) {
    const entry = 44 + i * 20
    const tag = woff.toString('latin1', entry, entry + 4)
    const offset = woff.readUInt32BE(entry + 4)
    const compLength = woff.readUInt32BE(entry + 8)
    const origLength = woff.readUInt32BE(entry + 12)
    const data = woff.subarray(offset, offset + compLength)
    tables.set(tag, compLength < origLength ? inflateSync(data) : data)
  }
  const table = (tag: string) => {
    const data = tables.get(tag)
    if (!data) throw new Error(`Falta la tabla ${tag} (¿fuente CFF?)`)
    return data
  }

  const head = table('head')
  const hhea = table('hhea')
  const hmtx = table('hmtx')
  const loca = table('loca')
  const glyf = table('glyf')
  const cmap = table('cmap')
  const longLoca = head.readInt16BE(50) === 1
  const numberOfHMetrics = hhea.readUInt16BE(34)

  // cmap: subtabla Unicode formato 4 (BMP)
  let format4 = -1
  for (let i = 0, n = cmap.readUInt16BE(2); i < n; i++) {
    const platform = cmap.readUInt16BE(4 + i * 8)
    const encoding = cmap.readUInt16BE(6 + i * 8)
    const offset = cmap.readUInt32BE(8 + i * 8)
    if ((platform === 3 && encoding === 1) || platform === 0) {
      if (cmap.readUInt16BE(offset) === 4) format4 = offset
    }
  }
  if (format4 < 0) throw new Error('La fuente no tiene cmap formato 4')

  const glyphIndex = (codePoint: number) => {
    const segCount = cmap.readUInt16BE(format4 + 6) / 2
    const ends = format4 + 14
    const starts = ends + segCount * 2 + 2
    const deltas = starts + segCount * 2
    const rangeOffsets = deltas + segCount * 2
    for (let s = 0; s < segCount; s++) {
      if (codePoint > cmap.readUInt16BE(ends + s * 2)) continue
      const start = cmap.readUInt16BE(starts + s * 2)
      if (codePoint < start) return 0
      const delta = cmap.readInt16BE(deltas + s * 2)
      const rangeOffset = cmap.readUInt16BE(rangeOffsets + s * 2)
      if (rangeOffset === 0) return (codePoint + delta) & 0xffff
      const glyph = cmap.readUInt16BE(rangeOffsets + s * 2 + rangeOffset + (codePoint - start) * 2)
      return glyph === 0 ? 0 : (glyph + delta) & 0xffff
    }
    return 0
  }

  const advance = (glyph: number) => hmtx.readUInt16BE(Math.min(glyph, numberOfHMetrics - 1) * 4)

  const glyphOffset = (glyph: number) => (longLoca ? loca.readUInt32BE(glyph * 4) : loca.readUInt16BE(glyph * 2) * 2)

  /** Contornos cuadráticos de TrueType → path SVG, con el eje y hacia abajo. */
  const path = (glyph: number, originX: number, baseline: number, scale: number) => {
    const start = glyphOffset(glyph)
    if (glyphOffset(glyph + 1) === start) return ''
    const contours = glyf.readInt16BE(start)
    if (contours < 0) throw new Error(`El glifo ${glyph} es compuesto; no está soportado`)

    let p = start + 10
    const endPoints: number[] = []
    for (let i = 0; i < contours; i++, p += 2) endPoints.push(glyf.readUInt16BE(p))
    const count = endPoints[endPoints.length - 1] + 1
    p += 2 + glyf.readUInt16BE(p) // instrucciones

    const flags: number[] = []
    while (flags.length < count) {
      const flag = glyf[p++]
      flags.push(flag)
      if (flag & 8) for (let r = glyf[p++]; r > 0; r--) flags.push(flag)
    }
    const coords = (shortBit: number, sameBit: number) => {
      const values: number[] = []
      let value = 0
      for (const flag of flags) {
        if (flag & shortBit) {
          value += flag & sameBit ? glyf[p++] : -glyf[p++]
        } else if (!(flag & sameBit)) {
          value += glyf.readInt16BE(p)
          p += 2
        }
        values.push(value)
      }
      return values
    }
    const xs = coords(2, 16)
    const ys = coords(4, 32)

    const fmt = (n: number) => Number(n.toFixed(2))
    const pt = (x: number, y: number) => `${fmt(originX + x * scale)} ${fmt(baseline - y * scale)}`
    let d = ''
    let first = 0
    for (const last of endPoints) {
      const points = []
      for (let i = first; i <= last; i++) points.push({ x: xs[i], y: ys[i], on: (flags[i] & 1) === 1 })
      first = last + 1
      // Arranca en un punto sobre la curva (o en el punto medio implícito entre dos de control)
      const startIndex = points.findIndex((q) => q.on)
      const ordered = startIndex >= 0 ? [...points.slice(startIndex), ...points.slice(0, startIndex)] : points
      const begin = ordered[0].on
        ? ordered[0]
        : { x: (ordered[0].x + ordered[ordered.length - 1].x) / 2, y: (ordered[0].y + ordered[ordered.length - 1].y) / 2, on: true }
      d += `M${pt(begin.x, begin.y)}`
      let control: { x: number; y: number } | null = null
      for (const q of [...ordered.slice(ordered[0].on ? 1 : 0), begin]) {
        if (q.on) {
          d += control ? `Q${pt(control.x, control.y)} ${pt(q.x, q.y)}` : `L${pt(q.x, q.y)}`
          control = null
        } else {
          if (control) {
            const mid = { x: (control.x + q.x) / 2, y: (control.y + q.y) / 2 }
            d += `Q${pt(control.x, control.y)} ${pt(mid.x, mid.y)}`
          }
          control = q
        }
      }
      d += 'Z'
    }
    return d
  }

  return {
    unitsPerEm: head.readUInt16BE(18),
    glyphIndex,
    advance,
    path,
  }
}

// ── Monograma ─────────────────────────────────────────────────────
// Proporciones medidas en el Logo (size md) renderizado: arco de 30 × 38 px, trazo 1.5 px, "CA" a 13 px con
// tracking 0.04em y la línea base a 6 px del borde inferior. Para que se lea a 16–32 px, trazo y letra crecen.
const font = readWoff(root('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'))

const SIZE = 512
const ARCH_H = 400
const ARCH_W = (ARCH_H * 30) / 38
const STROKE = 26 // 1.5 / 38 del Logo daría 16
const FONT_SIZE = 160 // 13 / 38 del Logo daría 137
const TRACKING = 0.04
const BASELINE_FROM_BOTTOM = (ARCH_H * 6) / 38

function monogram(text: string) {
  const scale = FONT_SIZE / font.unitsPerEm
  const glyphs = [...text].map((char) => font.glyphIndex(char.codePointAt(0)!))
  const tracking = TRACKING * FONT_SIZE
  const width = glyphs.reduce((sum, g) => sum + font.advance(g) * scale, 0) + tracking * (glyphs.length - 1)

  const archX = (SIZE - ARCH_W) / 2
  const archY = (SIZE - ARCH_H) / 2
  const inset = STROKE / 2
  const left = archX + inset
  const right = archX + ARCH_W - inset
  const top = archY + inset
  const bottom = archY + ARCH_H - inset
  const radius = (right - left) / 2
  const corner = 16 // rounded-arch-sm: 2 px abajo, escalado
  const arch = [
    `M${left} ${bottom - corner}`,
    `V${top + radius}`,
    `A${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
    `V${bottom - corner}`,
    `Q${right} ${bottom} ${right - corner} ${bottom}`,
    `H${left + corner}`,
    `Q${left} ${bottom} ${left} ${bottom - corner}`,
    'Z',
  ].join('')

  const baseline = archY + ARCH_H - BASELINE_FROM_BOTTOM

  let x = (SIZE - width) / 2
  const letters = glyphs
    .map((g) => {
      const d = font.path(g, x, baseline, scale)
      x += font.advance(g) * scale + tracking
      return d
    })
    .join('')

  return { arch, letters }
}

const { arch, letters } = monogram('CA')

/** rounded: true → baldosa con esquinas (favicon, íconos de la app); false → cuadrado lleno (iOS recorta solo). */
function svg({ rounded }: { rounded: boolean }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">`,
    `<rect width="${SIZE}" height="${SIZE}"${rounded ? ' rx="112"' : ''} fill="${SURFACE}"/>`,
    `<path d="${arch}" fill="none" stroke="${ACCENT}" stroke-width="${STROKE}"/>`,
    `<path d="${letters}" fill="${ACCENT}"/>`,
    '</svg>',
  ].join('')
}

/** ICO con una sola imagen PNG embebida (soportado desde Windows Vista y en todos los navegadores). */
function ico(png: Buffer, size: number) {
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // tipo: ícono
  header.writeUInt16LE(1, 4) // una imagen
  header.writeUInt8(size, 6)
  header.writeUInt8(size, 7)
  header.writeUInt16LE(1, 10) // planos
  header.writeUInt16LE(32, 12) // bits por pixel
  header.writeUInt32LE(png.length, 14)
  header.writeUInt32LE(22, 18)
  return Buffer.concat([header, png])
}

const browser = await chromium.launch()
const page = await browser.newPage()
async function png(markup: string, size: number) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`,
  )
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

const tile = svg({ rounded: true })
writeFileSync(root('public/icon.svg'), tile)
writeFileSync(root('public/favicon.ico'), ico(await png(tile, 32), 32))
writeFileSync(root('public/apple-touch-icon.png'), await png(svg({ rounded: false }), 180))
writeFileSync(root('public/icon-192.png'), await png(tile, 192))
writeFileSync(root('public/icon-512.png'), await png(tile, 512))
await browser.close()

console.log('Íconos generados en public/')
