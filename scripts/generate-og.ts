/**
 * Genera la imagen Open Graph (1200 × 630) con capturas reales del sitio en escritorio y en móvil.
 *   pnpm og        (construye el sitio y después corre este script)
 * Salida: public/og-image.png. La usan index.html (og:image, twitter:image) y el README.
 *
 * Sin dependencias nuevas: sirve dist/ con el preview de Vite, captura con el Chromium de Playwright y compone
 * la portada en una página propia. Colores de los primitivos de theme.css; fuentes de @fontsource, embebidas.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
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

const font = (file: string) =>
  readFileSync(root(`node_modules/@fontsource/${file}`)).toString('base64')
const DISPLAY = font('cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2')
const SANS = font('manrope/files/manrope-latin-400-normal.woff2')
const SANS_BOLD = font('manrope/files/manrope-latin-600-normal.woff2')

// ── Copy de la portada ───────────────────────────────────────────
const COPY = {
  eyebrow: 'Caso de estudio',
  title: 'Casa Alcanfor',
  lead: 'Un diseño de Claude Design llevado a React y Tailwind CSS v4.',
  detail: 'WCAG 2.2 AA como objetivo · Proyecto conceptual',
  author: 'Osvaldo Ocampo',
}

// ── Capturas del build ───────────────────────────────────────────
const server = await preview({ preview: { port: 4175, strictPort: true } })
const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4175/'
const browser = await chromium.launch()
/** Corre en el navegador; va como texto porque tsconfig.node.json no incluye los tipos del DOM. */
const FONTS_READY = 'document.fonts.ready.then(() => true)'

/** Captura la primera pantalla. Con reduced motion no hay reveal ni parallax: todo queda en su lugar. */
async function capture(width: number, height: number, deviceScaleFactor: number) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor, reducedMotion: 'reduce', locale: 'es-MX' })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(FONTS_READY)
  const shot = await page.screenshot()
  await context.close()
  return shot.toString('base64')
}

const desktop = await capture(1440, 900, 1)
const mobile = await capture(390, 844, 2)

// ── Composición ──────────────────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(`<!doctype html>
<style>
  @font-face { font-family: Display; font-weight: 600; src: url(data:font/woff2;base64,${DISPLAY}) format('woff2'); }
  @font-face { font-family: Sans; font-weight: 400; src: url(data:font/woff2;base64,${SANS}) format('woff2'); }
  @font-face { font-family: Sans; font-weight: 600; src: url(data:font/woff2;base64,${SANS_BOLD}) format('woff2'); }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${SURFACE}; }
  .copy { position: absolute; left: 64px; top: 0; bottom: 0; width: 380px; display: flex; flex-direction: column; justify-content: center; gap: 20px; font-family: Sans; color: ${TEXT}; }
  .eyebrow { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: ${ACCENT}; }
  h1 { margin: 0; font-family: Display; font-weight: 600; font-size: 76px; line-height: 1; }
  .lead { margin: 0; font-size: 24px; line-height: 1.35; }
  .detail { margin: 0; font-size: 17px; line-height: 1.4; color: ${TEXT_MUTED}; }
  .author { margin: 12px 0 0; padding-top: 20px; border-top: 1px solid ${BORDER}; font-size: 17px; font-weight: 600; }
  .shot { position: absolute; display: block; border: 1px solid ${BORDER}; box-shadow: 0 24px 48px rgb(30 26 23 / .18); }
  .desktop { left: 500px; top: 72px; width: 640px; height: 400px; border-radius: 10px; }
  .mobile { left: 456px; top: 214px; width: 170px; height: 368px; border-radius: 22px; border: 6px solid ${TEXT}; }
</style>
<div class="copy">
  <p class="eyebrow">${COPY.eyebrow}</p>
  <h1>${COPY.title}</h1>
  <p class="lead">${COPY.lead}</p>
  <p class="detail">${COPY.detail}</p>
  <p class="author">${COPY.author}</p>
</div>
<img class="shot desktop" alt="" src="data:image/png;base64,${desktop}">
<img class="shot mobile" alt="" src="data:image/png;base64,${mobile}">`)
await page.evaluate(FONTS_READY)
writeFileSync(root('public/og-image.png'), await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } }))

await browser.close()
await server.close()
console.log('Imagen OG generada en public/og-image.png')
