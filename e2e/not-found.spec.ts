import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { activeName, tabTo } from './helpers'

/** 404.html es lo que sirve Netlify; la ruta inexistente prueba el respaldo en el cliente (vite preview → index.html). */
const PATHS = ['/404.html', '/ruta/que/no/existe']

async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

for (const path of PATHS) {
  test(`404: muestra la página no encontrada en ${path}`, async ({ page }) => {
    await open(page, path)
    await expect(page).toHaveTitle('Página no encontrada · Casa Alcanfor')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página')
    await expect(page.getByText('Puede que el enlace esté incompleto o que la página ya no exista.')).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'Aviso del proyecto' })).toBeVisible()
    // Sin barra móvil, formulario ni diálogos
    await expect(page.locator('form, dialog, [data-sticky-cta]')).toHaveCount(0)
    await expect(page.getByRole('heading')).toHaveCount(1)
  })

  test(`404: axe sin violaciones serious/critical en ${path}`, async ({ page }) => {
    await open(page, path)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()
    const describe = (v: (typeof results.violations)[number]) => `${v.impact} · ${v.id} · ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`
    expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical' || v.id === 'region').map(describe)).toEqual([])
  })

  test(`404: enlaces con rutas absolutas en ${path}`, async ({ page }) => {
    await open(page, path)
    await expect(page.getByRole('banner').getByRole('link', { name: /^Casa Alcanfor.*inicio$/ })).toHaveAttribute('href', '/')
    await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
    await expect(page.getByRole('link', { name: 'Agenda tu visita' })).toHaveAttribute('href', '/#contacto')
    // Los recursos del build también son absolutos: la página carga igual en una ruta anidada
    const relative = await page.evaluate(() =>
      [...document.querySelectorAll('link[href], script[src]')]
        .map((el) => el.getAttribute('href') ?? el.getAttribute('src') ?? '')
        .filter((url) => !url.startsWith('/') && !url.startsWith('http')),
    )
    expect(relative).toEqual([])
  })
}

test('404: metadatos de 404.html', async ({ page }) => {
  await open(page, '/404.html')
  const head = page.locator('head')
  await expect(head.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await expect(head.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f7f2ea')
  await expect(head.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1)
  await expect(head.locator('link[rel="icon"][href="/icon.svg"]')).toHaveCount(1)
  await expect(head.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX')
  // Sin Open Graph, Twitter Card, canonical ni JSON-LD
  await expect(head.locator('meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"]')).toHaveCount(0)
})

test('404: ruta inexistente en vite preview no muestra la landing', async ({ page }) => {
  await open(page, '/eventos/boda-inexistente')
  await expect(page.locator('#contacto, #eventos')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página')
})

test('404: teclado real, skip link al h1 y los dos enlaces en orden', async ({ page }) => {
  await open(page, '/404.html')
  await page.keyboard.press('Tab')
  expect(await activeName(page)).toBe('Saltar al contenido')
  await page.keyboard.press('Enter')
  await expect(page.locator('main h1')).toBeFocused()

  await page.keyboard.press('Tab')
  expect(await activeName(page)).toBe('Volver al inicio')
  await page.keyboard.press('Tab')
  expect(await activeName(page)).toBe('Agenda tu visita')
})

test('404: «Volver al inicio» lleva a la landing', async ({ page }) => {
  await open(page, '/ruta/que/no/existe')
  await tabTo(page, 'Volver al inicio')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/')
  await expect(page.locator('#contacto')).toHaveCount(1)
})

test('404: «Agenda tu visita» lleva a la sección de contacto', async ({ page }) => {
  await open(page, '/404.html')
  await tabTo(page, 'Agenda tu visita')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/#contacto')
  await expect(page.locator('#contacto')).toBeVisible()
})

test('borde derecho a 1440 px con ventana alta: el aviso y el header llegan al borde', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop-1440', 'Un solo proyecto basta: el viewport se fija aquí')
  await page.setViewportSize({ width: 1440, height: 2000 })
  for (const path of ['/404.html', '/design-system.html']) {
    await open(page, path)
    const edges = await page.evaluate(() => ({
      gutter: getComputedStyle(document.documentElement).scrollbarGutter,
      scrolls: document.documentElement.scrollHeight > window.innerHeight,
      viewport: window.innerWidth,
      client: document.documentElement.clientWidth,
      notice: document.querySelector('aside')?.getBoundingClientRect().right ?? 0,
      header: document.querySelector('header')?.getBoundingClientRect().right ?? 0,
    }))
    expect(edges.gutter, path).toBe('auto')
    if (!edges.scrolls) {
      expect(edges.client, path).toBe(edges.viewport)
      if (path === '/404.html') expect(edges.notice, path).toBe(edges.viewport)
      expect(edges.header, path).toBe(edges.viewport)
    }
  }
  // La landing, con diálogos, reserva el canal de la barra para no saltar al abrir un modal
  await open(page, '/')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarGutter)).toBe('stable')
})
