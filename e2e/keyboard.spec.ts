import { test, expect, type Page } from '@playwright/test'
import { activeName, focusInsideOpenDialog, isMobile, tabTo } from './helpers'

/** Da `presses` vueltas de Tab (y luego Shift+Tab) y comprueba en cada paso que el foco no sale del diálogo. */
async function expectTabTrapped(page: Page, presses: number) {
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let i = 0; i < presses; i++) {
      await page.keyboard.press(key)
      expect(await focusInsideOpenDialog(page), `${key} #${i + 1} sacó el foco del diálogo`).toBe(true)
    }
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('skip link es el primer enfocable y lleva a <main>', async ({ page }) => {
  await page.keyboard.press('Tab')
  expect(await activeName(page)).toBe('Saltar al contenido')
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('logo: el nombre accesible empieza con el texto visible (WCAG 2.5.3)', async ({ page }) => {
  const home = page.getByRole('banner').getByRole('link', { name: /inicio$/ })
  // El sr-only (absolute) es bloque para Chrome: mete un espacio antes de la coma; no cambia lo que se lee.
  await expect(home).toHaveAccessibleName(/^Casa Alcanfor Jardín & Salón ?, inicio$/)
})

test('menú móvil: Tab atrapado, Escape y regreso del foco', async ({ page }) => {
  test.skip(!isMobile(page), 'El botón de menú solo existe por debajo de lg')
  await tabTo(page, 'Abrir menú')
  const opener = page.getByRole('button', { name: 'Abrir menú' })
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Menú' })
  await expect(dialog).toBeVisible()
  await expect(opener).toHaveAttribute('aria-expanded', 'true')
  expect(await focusInsideOpenDialog(page)).toBe(true)
  await expectTabTrapped(page, 14)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
  await expect(opener).toHaveAttribute('aria-expanded', 'false')
})

test('menú móvil: un enlace cierra el menú y enfoca la sección', async ({ page }) => {
  test.skip(!isMobile(page), 'El botón de menú solo existe por debajo de lg')
  await tabTo(page, 'Abrir menú')
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Menú' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('link', { name: 'Preguntas' }).focus()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeHidden()
  await expect(page.locator('#preguntas')).toBeFocused()
})

test('lightbox del recorrido: Tab atrapado, flechas, Escape y regreso del foco', async ({ page }) => {
  await tabTo(page, 'Recorre el salón')
  const opener = page.getByRole('button', { name: 'Recorre el salón' })
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Recorrido por los espacios' })
  await expect(dialog).toBeVisible()
  expect(await focusInsideOpenDialog(page)).toBe(true)
  await expectTabTrapped(page, 8)

  const img = dialog.locator('img')
  const first = await img.getAttribute('alt')
  await page.keyboard.press('ArrowRight')
  await expect(img).not.toHaveAttribute('alt', first ?? '')

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
})

test('lightbox de galería: alt descriptivo sin duplicar en figcaption', async ({ page }) => {
  const item = page.getByRole('button', { name: /^Ampliar foto/ }).first()
  await item.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Galería de fotos' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('1 de', { exact: false })).toBeVisible()
  const img = dialog.getByRole('img')
  const alt = await img.getAttribute('alt')
  expect(alt?.length ?? 0).toBeGreaterThan(5)
  // La figcaption muestra el mismo texto, pero queda fuera del árbol de accesibilidad.
  await expect(dialog.locator('figcaption')).toHaveAttribute('aria-hidden', 'true')
  await expect(dialog.getByText(alt ?? '')).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('2 de', { exact: false })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(item).toBeFocused()
})

test('tabs de espacios: flechas, Inicio y Fin con roving tabindex', async ({ page }) => {
  const tabs = page.getByRole('tablist').getByRole('tab')
  const count = await tabs.count()
  expect(count).toBeGreaterThan(1)

  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(1)).toBeFocused()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.nth(0)).toHaveAttribute('tabindex', '-1')
  await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'space-tab-1')

  await page.keyboard.press('End')
  await expect(tabs.nth(count - 1)).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(0)).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(tabs.nth(count - 1)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')

  // Tab sale del tablist al panel (no recorre las pestañas inactivas)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('tabpanel')).toBeFocused()
})

test('FAQ: Enter y Espacio alternan aria-expanded y el panel', async ({ page }) => {
  const faq = page.locator('#preguntas')
  const buttons = faq.locator('h3 > button')
  const first = buttons.nth(0)
  const second = buttons.nth(1)
  const panelOf = async (btn: typeof first) => page.locator(`[id="${await btn.getAttribute('aria-controls')}"]`)

  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await first.focus()
  await page.keyboard.press('Enter')
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(await panelOf(first)).toBeHidden()

  await page.keyboard.press('Tab')
  await expect(second).toBeFocused()
  await page.keyboard.press('Space')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(await panelOf(second)).toBeVisible()
})

test('formulario vacío: el foco va al resumen de errores y sus enlaces llevan al campo', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Enviar solicitud' })
  await submit.focus()
  await page.keyboard.press('Enter')

  const summary = page.getByRole('group', { name: /^Revisa \d+ campos/ })
  await expect(summary).toBeFocused()
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(6)

  await page.keyboard.press('Tab')
  const firstLink = summary.getByRole('link').first()
  await expect(firstLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('textbox', { name: /Nombre/ })).toBeFocused()
  const describedBy = await page.getByRole('textbox', { name: /Nombre/ }).getAttribute('aria-describedby')
  expect(describedBy).toBeTruthy()
})

test('capas fijas: dentro del <footer>, fixed, últimas en el orden de foco y con anillo claro', async ({ page }) => {
  const footer = page.getByRole('contentinfo')
  const whatsapp = footer.getByRole('link', { name: /^Escríbenos por WhatsApp/ }).filter({ visible: true })
  await expect(whatsapp).toHaveCount(1)

  const position = await whatsapp.evaluate((el) => {
    const fixed = el.closest('.fixed') ?? el
    return getComputedStyle(fixed).position
  })
  expect(position).toBe('fixed')

  // El aviso de privacidad es el último enlace del footer; Tab sigue a las capas fijas y WhatsApp cierra el orden.
  await footer.getByRole('link', { name: 'Aviso de privacidad' }).focus()
  if (isMobile(page)) {
    await page.keyboard.press('Tab')
    await expect(footer.getByRole('link', { name: 'Consulta disponibilidad' })).toBeFocused()
  }
  await page.keyboard.press('Tab')
  await expect(whatsapp).toBeFocused()
  // gold-700, no el gold-400 de la superficie oscura del footer. Se espera: `transition` anima outline-color.
  await expect.poll(() => whatsapp.evaluate((el) => getComputedStyle(el).outlineColor)).toBe('rgb(122, 92, 48)')
})

test('NumberStepper: + y − anuncian el nuevo valor en una región viva', async ({ page }) => {
  const live = page.getByRole('button', { name: 'Sumar 10 invitados' }).locator('xpath=..').locator('[aria-live]')
  await expect(live).toHaveAttribute('aria-live', 'polite')
  await expect(live).toHaveText('')

  await page.getByRole('button', { name: 'Sumar 10 invitados' }).focus()
  await page.keyboard.press('Enter')
  await expect(live).toHaveText('130 invitados')
  await page.getByRole('button', { name: 'Quitar 10 invitados' }).focus()
  await page.keyboard.press('Space')
  await expect(live).toHaveText('120 invitados')
})
