import { test, expect, type Page } from '@playwright/test'

/**
 * Filtros de la galería: el estado y la categoría de cada foto usan identificadores en inglés (all, weddings,
 * quinceaneras, baptisms, corporate); el chip y el conteo muestran el texto en español.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
})

const filters = (page: Page) => page.getByRole('group', { name: 'Filtrar galería por tipo de evento' })
const count = (page: Page) => page.locator('#galeria p[aria-live="polite"]')

test('cada chip filtra la galería y el conteo nombra el filtro en español', async ({ page }) => {
  await expect(filters(page).getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-pressed', 'true')
  await expect(count(page)).toHaveText('12 fotos')

  for (const [label, n] of [['Bodas', 5], ['XV años', 2], ['Bautizos', 2], ['Corporativos', 3]] as const) {
    await filters(page).getByRole('button', { name: label }).click()
    await expect(filters(page).getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
    await expect(count(page)).toHaveText(`${n} fotos de ${label}`)
    await expect(page.locator('#galeria ul > li')).toHaveCount(n)
  }
})

test('el enlace de una tarjeta de eventos activa su filtro en la galería', async ({ page }) => {
  await page.getByRole('link', { name: 'Ver ideas para XV años' }).click()
  await expect(filters(page).getByRole('button', { name: 'XV años' })).toHaveAttribute('aria-pressed', 'true')
  await expect(count(page)).toHaveText('2 fotos de XV años')
})
