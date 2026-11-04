import { test, expect } from '@playwright/test'
import { axProperty, browseText } from './helpers'

/**
 * Hallazgos de la pasada manual con NVDA (README § Pruebas manuales) que se pueden medir en el árbol de
 * accesibilidad de Chrome: textos que NVDA leía pegados en modo exploración, calificación incoherente,
 * campos "inválidos" antes de enviar y comillas desiguales en los testimonios.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('modo exploración: las piezas de cada texto llegan separadas', async ({ page }) => {
  const logo = page.getByRole('banner').getByRole('link', { name: /inicio$/ })
  expect(await browseText(logo)).toMatch(/^Casa Alcanfor, Jardín & Salón, inicio$/i)

  const trust = page.locator('ul', { has: page.getByText('eventos realizados') }).first()
  const trustText = await browseText(trust)
  expect(trustText).toContain('+1,200 eventos realizados')
  expect(trustText).toContain('Hasta 450 invitados')
  expect(trustText).not.toContain('450Hasta')

  expect(await browseText(page.getByText('años de experiencia · demo').locator('xpath=..'))).toBe('14 años de experiencia · demo')
  expect(await browseText(page.getByRole('heading', { name: /Cuéntanos tu idea/ }))).toBe('Paso 1: Cuéntanos tu idea')
  expect(await browseText(page.getByRole('tab').first())).toBe('Salón Gran Alcanfor, Hasta 450 invitados')
  expect(await browseText(page.locator('figcaption', { hasText: 'Andrea y Luis' }))).toMatch(/^Andrea y Luis, Boda, 280 invitados/)

  // \s también acepta el espacio de no separación que lleva el aria-label
  const newWindow = /^Escríbenos por WhatsApp\s\(se abre en una ventana nueva\)$/
  expect(await browseText(page.getByRole('link', { name: /^Cómo llegar/ }))).toBe('Cómo llegar (se abre en una ventana nueva)')
  expect(await browseText(page.locator('#contacto').getByRole('link', { name: /^Escríbenos por WhatsApp/ }))).toMatch(newWindow)
  // El botón flotante usa aria-label con el mismo texto
  const floating = page.getByRole('contentinfo').getByRole('link', { name: /^Escríbenos por WhatsApp/ }).filter({ visible: true }).last()
  await expect(floating).toHaveAccessibleName(newWindow)
})

test('calificación y precios: una sola frase coherente para el lector', async ({ page }) => {
  const summary = 'Calificación: 4.9 de 5, 320 reseñas en Google'
  expect(await browseText(page.locator('ul', { has: page.getByText('eventos realizados') }).first())).toContain(summary)
  expect(await browseText(page.locator('p', { hasText: '4.9 en Google · 320 reseñas' }))).toBe(summary)
  expect(await browseText(page.locator('p', { hasText: '320 reseñas en Google · demo' }))).toBe(`${summary}, demo`)

  // "$" lo leía NVDA como dólares: el precio dice la moneda en palabras
  expect(await browseText(page.locator('#paquetes p', { hasText: '$690' }))).toBe('Desde 690 pesos mexicanos por invitado')

  // "Más elegido" va después del título de su tarjeta (antes parecía de la tarjeta anterior)
  const card = (await browseText(page.locator('#paquetes li', { has: page.getByRole('heading', { name: 'Celebración' }) }))).toLowerCase()
  expect(card.indexOf('celebración')).toBeLessThan(card.indexOf('más elegido'))
})

test('testimonios con comillas iguales y sin aviso de privacidad sin enlace', async ({ page }) => {
  const quotes = page.locator('blockquote')
  await expect(quotes).toHaveCount(3)
  for (const quote of await quotes.all()) expect(await browseText(quote)).not.toMatch(/[“”"]/)
  await expect(page.getByText(/aviso de privacidad/i)).toHaveCount(0)
})

test('formulario: nada se anuncia inválido antes del primer envío', async ({ page }) => {
  const form = page.locator('#contacto form')
  // Con required nativo, Chrome exponía el select y la fecha vacíos como inválidos desde la carga
  // (con required nativo, este mismo chequeo da invalid="true" en el select y la fecha)
  for (const id of ['#quote-tipo', '#quote-fecha', '#quote-name']) {
    const field = form.locator(id)
    expect(await axProperty(field, 'invalid'), `${id} inválido al cargar`).toBe('false')
    // Sigue siendo obligatorio para el lector. CDP no lista "required" en select ni fecha: se revisa el atributo
    await expect(field, `${id} obligatorio`).toHaveAttribute('aria-required', 'true')
  }

  // Salir de un campo con un valor incorrecto tampoco lo marca antes de enviar
  await form.locator('#quote-email').fill('correo-incompleto')
  await page.keyboard.press('Tab')
  await expect(form.locator('[aria-invalid]')).toHaveCount(0)

  await page.getByRole('button', { name: 'Enviar solicitud' }).click()
  await expect(form.locator('[aria-invalid="true"]')).toHaveCount(6)
})
