import type { Locator, Page } from '@playwright/test'

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/** Nodo del árbol de accesibilidad de Chrome (CDP) que corresponde al elemento y el árbol completo. */
async function axTree(locator: Locator) {
  const page = locator.page()
  const marker = `ax-${Math.random().toString(36).slice(2)}`
  await locator.evaluate((el, value) => el.setAttribute('data-ax-probe', value), marker)
  const cdp = await page.context().newCDPSession(page)
  try {
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-ax-probe="${marker}"]` })
    const { node } = await cdp.send('DOM.describeNode', { nodeId })
    const { nodes } = await cdp.send('Accessibility.getFullAXTree')
    const start = nodes.find((n) => n.backendDOMNodeId === node.backendNodeId)
    if (!start) throw new Error('El elemento no está en el árbol de accesibilidad')
    return { start, byId: new Map(nodes.map((n) => [n.nodeId, n])) }
  } finally {
    await cdp.detach()
    await locator.evaluate((el) => el.removeAttribute('data-ax-probe'))
  }
}

/**
 * Texto que lee NVDA en modo exploración: los StaticText del subárbol en el árbol de Chrome, en orden y
 * sin añadir separadores (si dos piezas no traen espacio entre ellas, salen pegadas, como las leía NVDA).
 * Lo oculto con aria-hidden no cuenta. Los espacios (también el de no separación) se normalizan a uno.
 */
export async function browseText(locator: Locator) {
  const { start, byId } = await axTree(locator)
  const parts: string[] = []
  const walk = (id: string) => {
    const node = byId.get(id)
    if (!node) return
    if (!node.ignored && node.role?.value === 'StaticText') parts.push(String(node.name?.value ?? ''))
    for (const child of node.childIds ?? []) walk(child)
  }
  walk(start.nodeId)
  return parts.join('').replace(/\s+/g, ' ').trim()
}

/** Valor de una propiedad del nodo de accesibilidad de Chrome (p. ej. "invalid", "required"). */
export async function axProperty(locator: Locator, name: string) {
  const { start } = await axTree(locator)
  return start.properties?.find((p) => p.name === name)?.value.value
}

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
