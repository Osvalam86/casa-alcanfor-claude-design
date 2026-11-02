import type { Page } from '@playwright/test'

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/** Recorre la página para que el reveal (IntersectionObserver) muestre todo antes de auditar. */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
}

/** Nombre accesible aproximado del elemento enfocado (aria-label o texto). */
export function activeName(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el) return ''
    return (el.getAttribute('aria-label') ?? el.textContent ?? '').trim()
  })
}

/** Pulsa Tab hasta enfocar un elemento cuyo nombre empiece con `name`. Falla si no llega en `max` pasos. */
export async function tabTo(page: Page, name: string, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab')
    if ((await activeName(page)).startsWith(name)) return
  }
  throw new Error(`No se llegó con Tab a "${name}" en ${max} pasos`)
}

/** true si el foco está dentro del <dialog open>. */
export function focusInsideOpenDialog(page: Page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('dialog[open]')
    return !!dialog && dialog.contains(document.activeElement)
  })
}
