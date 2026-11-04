/**
 * Genera las dos portadas de 1200 × 630 con capturas reales del sitio en escritorio y en móvil.
 *   pnpm og        (construye el sitio y después corre este script)
 * Salida:
 *   docs/cover.png       portada del README: caso de estudio, herramientas y objetivo WCAG.
 *   public/og-image.png  og:image y twitter:image: neutra, solo el negocio y "Proyecto conceptual".
 *
 * Sin dependencias nuevas: sirve dist/ con el preview de Vite, captura con el Chromium de Playwright y compone
 * cada portada en una página propia. Colores de los primitivos de theme.css; fuentes de @fontsource, embebidas.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from '@playwright/test'
import { preview } from 'vite'

const root = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

// ── Tokens (primitivos de theme.css) ──────────────────────────────
const theme = readFileSync(root('src/styles/theme.css'), 'utf8')
const token = (name: string) => {
  const match = theme.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{3,8})`, 'i'))
  if (!match) throw new Error(`No se encontró --${name} en theme.css`)
  return match[1]
}
const SURFACE = token('ivory-50') // --color-surface
const TEXT = token('charcoal-900') // --color-text
const TEXT_MUTED = token('charcoal-600') // --color-text-muted
const ACCENT = token('gold-700') // --color-accent
const BORDER = token('sand-200') // --color-border

const font = (file: string) => readFileSync(root(`node_modules/@fontsource/${file}`)).toString('base64')
const DISPLAY = font('cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2')
const SANS = font('manrope/files/manrope-latin-400-normal.woff2')
const SANS_BOLD = font('manrope/files/manrope-latin-600-normal.woff2')

// ── Copy de cada portada ─────────────────────────────────────────
type Cover = { file: string; eyebrow?: string; title: string; lead: string; detail: string; author?: string }

const COVERS: Cover[] = [
  {
    file: 'docs/cover.png',
    eyebrow: 'Caso de estudio',
    title: 'Casa Alcanfor',
    lead: 'Un diseño de Claude Design llevado a React y Tailwind CSS v4.',
    detail: 'WCAG 2.2 AA como objetivo · Proyecto conceptual',
    author: 'Osvaldo Ocampo',
  },
  {
    file: 'public/og-image.png',
    title: 'Casa Alcanfor',
    lead: 'Jardín & Salón de Eventos',
    detail: 'Proyecto conceptual',
  },
]

// ── Composición (px del lienzo de 1200 × 630) ────────────────────
const CANVAS = { width: 1200, height: 630 }
const COLUMN = { left: 56, width: 320 }
// El móvil va en el lateral derecho: solo su borde izquierdo (OVERLAP de su ancho) se encima sobre el desktop,
// el resto queda fuera, y sale un poco por el borde inferior. El desktop ocupa lo que queda entre la columna y el móvil.
const PHONE = { width: 180, viewport: { width: 390, height: 844 }, overflow: 28, frame: 6, right: 24 }
const PHONE_OUTER = PHONE.width + 2 * PHONE.frame
const PHONE_HEIGHT = (PHONE.width * PHONE.viewport.height) / PHONE.viewport.width
const PHONE_LEFT = CANVAS.width - PHONE.right - PHONE_OUTER
const PHONE_TOP = Math.round(CANVAS.height + PHONE.overflow - PHONE_HEIGHT - 2 * PHONE.frame)
const OVERLAP = 0.28
/** Sección que muestra el móvil: distinta del hero del desktop para no repetir el mismo texto. */
const PHONE_SECTION = '#galeria'

const DESKTOP_LEFT = COLUMN.left + COLUMN.width + 28
const DESKTOP = {
  left: DESKTOP_LEFT,
  top: 64,
  width: Math.round(PHONE_LEFT + OVERLAP * PHONE_OUTER - DESKTOP_LEFT),
  viewport: { width: 1440, height: 900 },
}
const DESKTOP_HEIGHT = (DESKTOP.width * DESKTOP.viewport.height) / DESKTOP.viewport.width
/** Mínimo de la foto del arco que debe quedar a la vista. */
const MIN_ARCH_VISIBLE = 0.7

// ── Capturas del build ───────────────────────────────────────────
const server = await preview({ preview: { port: 4175, strictPort: true } })
const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4175/'
const browser = await chromium.launch()
/** Corren en el navegador; van como texto porque tsconfig.node.json no incluye los tipos del DOM. */
const FONTS_READY = 'document.fonts.ready.then(() => true)'
/** Espera a que las imágenes visibles terminen de cargar (las lazy aparecen al hacer scroll). */
const IMAGES_READY = `Promise.all([...document.images]
  .filter((img) => { const r = img.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight })
  .map((img) => img.complete ? null : new Promise((done) => { img.onload = img.onerror = done })))
  .then(() => true)`
/** Caja de la foto más grande del hero (el arco), en px del viewport. */
const ARCH_BOX = `(() => {
  const imgs = [...document.querySelectorAll('#top img')].map((img) => img.getBoundingClientRect())
  const box = imgs.sort((a, b) => b.width * b.height - a.width * a.height)[0]
  return { x: box.x, y: box.y, width: box.width, height: box.height }
})()`

type Box = { x: number; y: number; width: number; height: number }

/**
 * Captura una pantalla: la primera o, con `section`, la que empieza en esa sección (el scroll respeta el
 * scroll-padding del header). Con reduced motion no hay reveal ni parallax: todo queda en su lugar.
 */
async function capture(viewport: { width: number; height: number }, deviceScaleFactor: number, section?: string) {
  const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'reduce', locale: 'es-MX' })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  if (section) {
    await page.evaluate(`document.querySelector(${JSON.stringify(section)}).scrollIntoView({ block: 'start' })`)
    await page.waitForLoadState('networkidle')
  }
  await page.evaluate(FONTS_READY)
  await page.evaluate(IMAGES_READY)
  const arch = (await page.evaluate(ARCH_BOX)) as Box
  const shot = (await page.screenshot()).toString('base64')
  await context.close()
  return { shot, arch }
}

const desktop = await capture(DESKTOP.viewport, 1)
const mobile = await capture(PHONE.viewport, 2, PHONE_SECTION)

// Comprueba que el móvil deja a la vista al menos MIN_ARCH_VISIBLE de la foto del arco.
const scale = DESKTOP.width / DESKTOP.viewport.width
const arch = {
  left: DESKTOP.left + desktop.arch.x * scale,
  top: DESKTOP.top + desktop.arch.y * scale,
  right: DESKTOP.left + (desktop.arch.x + desktop.arch.width) * scale,
  bottom: Math.min(DESKTOP.top + (desktop.arch.y + desktop.arch.height) * scale, DESKTOP.top + DESKTOP_HEIGHT),
}
const covered =
  Math.max(0, arch.right - Math.max(arch.left, PHONE_LEFT)) * Math.max(0, arch.bottom - Math.max(arch.top, PHONE_TOP))
const archVisible = 1 - covered / ((arch.right - arch.left) * (arch.bottom - arch.top))
if (archVisible < MIN_ARCH_VISIBLE) throw new Error(`El móvil tapa el arco: queda a la vista el ${(archVisible * 100).toFixed(0)} %`)
console.log(`Desktop de ${DESKTOP.width} px; el móvil se encima un ${Math.round(OVERLAP * 100)} %; arco a la vista: ${(archVisible * 100).toFixed(0)} %`)

const paragraph = (className: string, text?: string) => (text ? `<p class="${className}">${text}</p>` : '')

async function compose(page: Page, cover: Cover) {
  await page.setContent(`<!doctype html>
<style>
  @font-face { font-family: Display; font-weight: 600; src: url(data:font/woff2;base64,${DISPLAY}) format('woff2'); }
  @font-face { font-family: Sans; font-weight: 400; src: url(data:font/woff2;base64,${SANS}) format('woff2'); }
  @font-face { font-family: Sans; font-weight: 600; src: url(data:font/woff2;base64,${SANS_BOLD}) format('woff2'); }
  html, body { margin: 0; width: ${CANVAS.width}px; height: ${CANVAS.height}px; overflow: hidden; background: ${SURFACE}; }
  .copy { position: absolute; left: ${COLUMN.left}px; width: ${COLUMN.width}px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 20px; font-family: Sans; color: ${TEXT}; }
  .eyebrow { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: ${ACCENT}; }
  h1 { margin: 0; font-family: Display; font-weight: 600; font-size: 84px; line-height: .98; }
  .lead { margin: 0; font-size: 27px; line-height: 1.3; }
  .detail { margin: 0; font-size: 20px; line-height: 1.4; color: ${TEXT_MUTED}; }
  .author { margin: 8px 0 0; padding-top: 20px; border-top: 1px solid ${BORDER}; font-size: 20px; font-weight: 600; }
  .shot { position: absolute; display: block; box-shadow: 0 24px 48px rgb(30 26 23 / .2); }
  .desktop { left: ${DESKTOP.left}px; top: ${DESKTOP.top}px; width: ${DESKTOP.width}px; height: ${DESKTOP_HEIGHT}px; border: 1px solid ${BORDER}; border-radius: 10px; }
  .mobile { left: ${PHONE_LEFT}px; top: ${PHONE_TOP}px; width: ${PHONE.width}px; height: ${PHONE_HEIGHT}px; border: ${PHONE.frame}px solid ${TEXT}; border-radius: 26px; }
</style>
<div class="copy">
  ${paragraph('eyebrow', cover.eyebrow)}
  <h1>${cover.title}</h1>
  ${paragraph('lead', cover.lead)}
  ${paragraph('detail', cover.detail)}
  ${paragraph('author', cover.author)}
</div>
<img class="shot desktop" alt="" src="data:image/png;base64,${desktop.shot}">
<img class="shot mobile" alt="" src="data:image/png;base64,${mobile.shot}">`)
  await page.evaluate(FONTS_READY)
  const file = root(cover.file)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, await page.screenshot({ clip: { x: 0, y: 0, ...CANVAS } }))
}

const page = await browser.newPage({ viewport: CANVAS })
for (const cover of COVERS) await compose(page, cover)

await browser.close()
await server.close()
console.log(`Portadas generadas: ${COVERS.map((cover) => cover.file).join(', ')}`)
