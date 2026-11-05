import { test, expect, type Page } from '@playwright/test'
import { axIgnored, focusObscured, isMobile } from './helpers'

/**
 * Barra fija inferior de móvil (MobileStickyCTA). Estado inicial: solo WhatsApp flotando. Cuando el botón
 * principal del hero sale de pantalla aparecen el fondo y «Consulta disponibilidad»; mientras se ve la
 * cotización vuelve al estado inicial. Solo existe por debajo de md: estas pruebas corren a 390 px.
 */

const bar = (page: Page) => page.locator('[data-sticky-cta]')
const cta = (page: Page) => bar(page).getByRole('link', { name: 'Consulta disponibilidad', includeHidden: true })
const whatsapp = (page: Page) => bar(page).getByRole('link', { name: /^Escríbenos por WhatsApp/ })

/** Lleva un elemento arriba de la pantalla sin animar y espera a que la barra termine su transición. */
async function scrollToSection(page: Page, selector: string) {
  await page.locator(selector).evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  await settle(page)
}

async function settle(page: Page) {
  await page.waitForTimeout(150) // el IntersectionObserver notifica en el siguiente frame
  await bar(page).evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)))
}

/** Estado visible de la barra: fondo y botón juntos, y el botón fuera del orden de foco si está oculto. */
async function expectState(page: Page, state: 'shown' | 'hidden') {
  await expect(bar(page)).toHaveAttribute('data-sticky-cta', state)
  const background = bar(page).locator('> [aria-hidden="true"]')
  const opacity = state === 'shown' ? '1' : '0'
  await expect.poll(() => background.evaluate((el) => getComputedStyle(el).opacity)).toBe(opacity)
  await expect.poll(() => cta(page).evaluate((el) => getComputedStyle(el).opacity)).toBe(opacity)
  if (state === 'shown') await expect(cta(page)).not.toHaveAttribute('inert')
  else await expect(cta(page)).toHaveAttribute('inert', '')
  await expect(whatsapp(page)).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  test.skip(!isMobile(page), 'La barra solo existe por debajo de md')
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await settle(page)
})

test('estado inicial al cargar: solo WhatsApp, sin fondo de barra', async ({ page }) => {
  await expect(page.locator('#hero-cta')).toBeInViewport()
  await expectState(page, 'hidden')
})

test('al pasar el botón del hero aparecen el fondo y «Consulta disponibilidad»', async ({ page }) => {
  await scrollToSection(page, '#espacios')
  await expect(page.locator('#hero-cta')).not.toBeInViewport()
  await expectState(page, 'shown')
})

test('con la cotización a la vista vuelve al estado inicial', async ({ page }) => {
  await scrollToSection(page, '#espacios')
  await expectState(page, 'shown')
  await scrollToSection(page, '#contacto')
  await expectState(page, 'hidden')
})

test('WhatsApp tiene la misma posición y el mismo tamaño en los dos estados', async ({ page }) => {
  const initial = await whatsapp(page).boundingBox()
  await scrollToSection(page, '#espacios')
  await expectState(page, 'shown')
  const withBar = await whatsapp(page).boundingBox()
  expect(withBar).toEqual(initial)
})

test('oculto, «Consulta disponibilidad» no recibe foco: Tab pasa directo a WhatsApp', async ({ page }) => {
  await expectState(page, 'hidden')
  // El último enlace del footer, sin desplazar la página (el estado sigue siendo el inicial)
  await page.getByRole('contentinfo').getByRole('link', { name: /^TikTok/ }).evaluate((el: HTMLElement) => el.focus({ preventScroll: true }))
  await page.keyboard.press('Tab')
  await expect(whatsapp(page)).toBeFocused()
  await expect(cta(page)).not.toBeFocused()
  // Fuera del árbol de accesibilidad de Chrome (lo que recorre el lector); con la barra visible vuelve a estar
  expect(await axIgnored(cta(page))).toBe(true)
  await scrollToSection(page, '#espacios')
  await expectState(page, 'shown')
  expect(await axIgnored(cta(page))).toBe(false)
})

test('foco no tapado con el estado inicial (hero)', async ({ page }) => {
  await expectState(page, 'hidden')
  const obscured: string[] = []
  let checked = 0
  // Del skip link en adelante; solo cuentan los pasos en que la barra sigue en el estado inicial
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab')
    const result = await focusObscured(page)
    if ((await bar(page).getAttribute('data-sticky-cta')) !== 'hidden') continue
    checked++
    if (result?.hit) obscured.push(result.hit)
  }
  expect(checked).toBeGreaterThan(5)
  expect(obscured).toEqual([])
})

test('foco no tapado con la barra visible', async ({ page }) => {
  await scrollToSection(page, '#espacios')
  await expectState(page, 'shown')
  // Primer enfocable de la sección y los siguientes, con la barra visible
  await page.locator('#espacios').getByRole('tab').first().focus()
  const obscured: string[] = []
  let checked = 0
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab')
    const result = await focusObscured(page)
    if ((await bar(page).getAttribute('data-sticky-cta')) !== 'shown') continue
    checked++
    if (result?.hit) obscured.push(result.hit)
  }
  expect(checked).toBeGreaterThan(10)
  expect(obscured).toEqual([])
})
