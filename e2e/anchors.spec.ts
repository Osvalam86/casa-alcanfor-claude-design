import { test, expect, type Page } from '@playwright/test'
import { isMobile } from './helpers'

/** Destinos de landing.nav.links (se ubican por href, no por texto). */
const SECTIONS = ['eventos', 'espacios', 'paquetes', 'galeria', 'preguntas']

/** Desde arriba el header pasa de abierto a compacto durante el scroll; con scroll ya está compacto. */
const STARTS = [
  { name: 'desde arriba', y: 0 },
  { name: 'con la página ya desplazada', y: 400 },
]

/** Espera a que el scroll (suave) termine: scrollY sin cambios durante 250 ms. */
async function waitForScrollEnd(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const start = window.scrollY
          await new Promise((resolve) => setTimeout(resolve, 250))
          return start > 0 && window.scrollY === start
        }),
      { timeout: 8_000 },
    )
    .toBe(true)
}

/** Borde superior de la sección vs. borde inferior del header, ya compactado. */
function edges(page: Page, sectionId: string) {
  return page.evaluate((id) => {
    const header = document.querySelector('body header')!.getBoundingClientRect()
    const section = document.getElementById(id)!.getBoundingClientRect()
    return { headerBottom: header.bottom, sectionTop: section.top }
  }, sectionId)
}

for (const id of SECTIONS) {
  for (const start of STARTS) {
    test(`ancla #${id} ${start.name}: la sección queda justo debajo del header`, async ({ page }) => {
      await page.goto('/')
      if (start.y) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start.y)
        await page.waitForTimeout(500)
      }
      const header = page.getByRole('banner')

      if (isMobile(page)) {
        await header.locator('button[aria-haspopup="dialog"]').click()
        await page.getByRole('dialog').locator(`a[href="#${id}"]`).click()
      } else {
        await header.getByRole('navigation').locator(`a[href="#${id}"]`).click()
      }

      await waitForScrollEnd(page)
      // La transición del header (abierto → compacto) puede terminar después del scroll
      await page.waitForTimeout(500)
      const { headerBottom, sectionTop } = await edges(page, id)
      expect(Math.abs(sectionTop - headerBottom), `sección ${sectionTop}px · header ${headerBottom}px`).toBeLessThanOrEqual(1)
    })
  }
}
