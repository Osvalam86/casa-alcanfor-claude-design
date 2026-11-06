import { test, expect, type Locator } from '@playwright/test'
import { tabTo } from './helpers'

const outline = (locator: Locator) => locator.evaluate((el) => getComputedStyle(el).outlineStyle)

test('contorno de foco: los destinos de foco por script no lo muestran', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Teclado real: con la última interacción de teclado, el foco por script sí activa :focus-visible
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  const h1 = page.locator('main h1')
  await expect(h1).toBeFocused()
  await expect(h1).toHaveAttribute('tabindex', '-1')
  expect(await outline(h1)).toBe('none')

  // <main> con tabindex="-1" (catálogo): tampoco es un control
  await page.goto('/design-system.html')
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  const target = page.locator(':focus')
  await expect(target).toHaveAttribute('tabindex', '-1')
  expect(await outline(target)).toBe('none')
})

test('contorno de foco: un control con tabindex="-1" lo conserva', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const tab = page.getByRole('tab', { selected: true })
  await tabTo(page, (await tab.textContent())?.trim() ?? '', 120)
  await expect(tab).toBeFocused()
  // Pestaña inactiva del roving tabindex: tabindex="-1" sin dejar de ser un control
  await tab.evaluate((el) => el.setAttribute('tabindex', '-1'))
  await expect(tab).toBeFocused()
  expect(await outline(tab)).toBe('solid')
})
