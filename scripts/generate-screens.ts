/**
 * Capturas limpias del sitio a 2x, sin marcos ni fondos, para documentación.
 *   pnpm screens   (construye el sitio y después corre este script)
 * Salida en docs/screens/:
 *   desktop-hero.png      1440 px, primera pantalla.
 *   desktop-espacios.png  1440 px, la sección de espacios con sus pestañas.
 *   mobile-hero.png       360 px, primera pantalla, sin la barra fija ni el botón de WhatsApp.
 *   mobile-galeria.png    360 px, la galería recortada a una pantalla: título, filtros y las primeras fotos.
 *
 * Con movimiento reducido: sin reveal ni parallax, así no quedan secciones vacías. Sin dependencias nuevas:
 * sirve dist/ con el preview de Vite y captura con el Chromium de Playwright.
 */
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { preview } from 'vite'

const root = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))
const OUT = 'docs/screens'

// Capas que taparían el contenido. Solo se ocultan en la captura, con la opción `style` de Playwright.
const FIXED_LAYERS = 'footer > [data-surface="default"]' // barra fija móvil y botón de WhatsApp
const HIDE = (selectors: string) => `${selectors} { visibility: hidden !important; }`
/** En las capturas de sección también estorban el header sticky y el skip link. */
const HIDE_FOR_SECTION = HIDE(`header, a[href="#main"], ${FIXED_LAYERS}`)

type Shot = {
  file: string
  viewport: { width: number; height: number }
  /** Sección que se captura; sin ella, la primera pantalla. */
  section?: string
  /** Alto máximo de la captura de sección, en px CSS; sin él, la sección completa. */
  maxHeight?: number
  style?: string
}

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 360, height: 800 }

const SHOTS: Shot[] = [
  { file: 'desktop-hero.png', viewport: DESKTOP },
  { file: 'desktop-espacios.png', viewport: DESKTOP, section: '#espacios', style: HIDE_FOR_SECTION },
  { file: 'mobile-hero.png', viewport: MOBILE, style: HIDE(FIXED_LAYERS) },
  { file: 'mobile-galeria.png', viewport: MOBILE, section: '#galeria', maxHeight: MOBILE.height, style: HIDE_FOR_SECTION },
]

// Corren en el navegador; van como texto porque tsconfig.node.json no incluye los tipos del DOM.
const FONTS_READY = 'document.fonts.ready.then(() => true)'
/** Carga ya las imágenes lazy de un contenedor y espera a que terminen. */
const imagesReady = (selector: string) => `Promise.all([...document.querySelectorAll(${JSON.stringify(`${selector} img`)})]
  .map((img) => img.complete && img.naturalWidth ? null : new Promise((done) => { img.loading = 'eager'; img.onload = img.onerror = done })))
  .then(() => true)`
/** Caja de un elemento en coordenadas del documento (no del viewport). */
const documentBox = (selector: string) => `(() => {
  const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect()
  return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }
})()`

type Box = { x: number; y: number; width: number; height: number }

mkdirSync(root(OUT), { recursive: true })
const server = await preview({ preview: { port: 4176, strictPort: true } })
const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4176/'
const browser = await chromium.launch()

for (const shot of SHOTS) {
  const context = await browser.newContext({ viewport: shot.viewport, deviceScaleFactor: 2, reducedMotion: 'reduce', locale: 'es-MX' })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(FONTS_READY)
  const path = root(`${OUT}/${shot.file}`)

  if (shot.section) {
    await page.locator(shot.section).scrollIntoViewIfNeeded()
    await page.evaluate(imagesReady(shot.section))
    await page.waitForLoadState('networkidle')
    const box = (await page.evaluate(documentBox(shot.section))) as Box
    const clip = { ...box, height: shot.maxHeight ? Math.min(box.height, shot.maxHeight) : box.height }
    await page.screenshot({ path, fullPage: true, clip, style: shot.style, animations: 'disabled' })
  } else {
    await page.evaluate(imagesReady('body'))
    await page.screenshot({ path, style: shot.style, animations: 'disabled' })
  }

  await context.close()
  console.log(`${OUT}/${shot.file}`)
}

await browser.close()
await server.close()
