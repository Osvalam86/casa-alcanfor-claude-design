import { test, expect, type Page } from '@playwright/test'
import { focusObscured, revealAll } from './helpers'

const PAGES = ['/', '/design-system.html']

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => el.getBoundingClientRect().right > root.clientWidth + 1)
      .filter((el) => getComputedStyle(el).position !== 'fixed' && !el.closest('dialog, .sr-only, [role="tablist"]'))
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`)
    return { scroll: root.scrollWidth - root.clientWidth, offenders }
  })
}

// 320 px (reflow, WCAG 1.4.10) y 640 px = 1280 px con zoom al 200 %.
for (const width of [320, 640]) {
  for (const path of PAGES) {
    test(`sin scroll horizontal a ${width}px en ${path}`, async ({ page }) => {
      test.skip(test.info().project.name !== 'mobile-390', 'Un solo proyecto basta: el viewport se fija aquí')
      await page.setViewportSize({ width, height: 800 })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await revealAll(page)
      const { scroll, offenders } = await horizontalOverflow(page)
      expect(scroll, offenders.join('\n')).toBeLessThanOrEqual(0)
    })
  }
}

test('zoom 200 %: texto al doble sigue sin scroll horizontal (1280 px, deviceScaleFactor 2)', async ({ browser }) => {
  test.skip(test.info().project.name !== 'desktop-1440', 'Un solo proyecto basta')
  const context = await browser.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 })
  const page = await context.newPage()
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await revealAll(page)
  expect((await horizontalOverflow(page)).scroll).toBeLessThanOrEqual(0)
  // El menú (lg-) sigue disponible a este ancho efectivo
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible()
  await context.close()
})

test('prefers-reduced-motion: reduce desactiva reveal, parallax y transiciones', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const state = await page.evaluate(async () => {
    window.scrollTo(0, 500)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length
    const heroImg = document.querySelector<HTMLImageElement>('#top img')
    const transitions = [...document.querySelectorAll('button, a')].filter((el) => {
      const d = getComputedStyle(el).transitionDuration
      return d.split(',').some((v) => parseFloat(v) > 0)
    }).length
    return {
      jsReveal: document.documentElement.classList.contains('js-reveal'),
      hidden,
      heroTransform: heroImg?.style.transform ?? '',
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitions,
      animations: document.getAnimations().length,
    }
  })
  expect(state).toEqual({ jsReveal: false, hidden: 0, heroTransform: '', scrollBehavior: 'auto', transitions: 0, animations: 0 })
  await context.close()
})

/**
 * WCAG 2.4.11 (Focus Not Obscured): recorre la landing completa con Tab y comprueba que ningún
 * elemento enfocado quede tapado por las capas fijas (barra móvil, botón de WhatsApp, header sticky).
 */
test('ningún foco queda tapado por WhatsApp, la barra móvil o el header', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await revealAll(page)

  const obscured: string[] = []
  const seen = new Set<string>()
  for (let i = 0; i < 260; i++) {
    await page.keyboard.press('Tab')
    const result = await focusObscured(page)
    if (!result) continue
    if (seen.has(result.key) && i > 20) break
    seen.add(result.key)
    if (result.hit) obscured.push(result.hit)
  }
  expect(obscured).toEqual([])
})
