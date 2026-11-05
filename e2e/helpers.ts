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

/** true si Chrome deja el elemento fuera del árbol de accesibilidad (ignorado o ausente), p. ej. por inert. */
export async function axIgnored(locator: Locator) {
  try {
    const { start } = await axTree(locator)
    return !!start.ignored
  } catch {
    return true
  }
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

/**
 * WCAG 2.4.11 para el elemento enfocado: espera a que el scroll y las transiciones de las capas fijas se
 * asienten y devuelve qué capa fixed/sticky lo tapa ('' si ninguna). null si no hay foco en un elemento.
 * Una capa tapa si se solapa con el foco y, en el centro de la zona solapada, queda por encima de él.
 * Las piezas ocultas de la barra móvil no cuentan: no reciben eventos (pointer-events: none) y
 * elementFromPoint no las devuelve.
 */
export function focusObscured(page: Page) {
  return page.evaluate(async () => {
    // Con scroll-behavior: smooth el foco desplaza animando: se mide cuando el scroll se asienta.
    let last = -1
    while (last !== window.scrollY) {
      last = window.scrollY
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
    // La barra móvil puede cambiar de estado con ese scroll: se espera a que termine su transición.
    const sticky = document.querySelector('[data-sticky-cta]')
    if (sticky) await Promise.all(sticky.getAnimations({ subtree: true }).map((a) => a.finished))
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return null
    const key = el.id || el.outerHTML.slice(0, 80)
    const overlays = [...document.querySelectorAll<HTMLElement>('body *')].filter((node) => {
      const pos = getComputedStyle(node).position
      return (pos === 'fixed' || pos === 'sticky') && node.checkVisibility() && !node.contains(el) && node.getBoundingClientRect().height < window.innerHeight / 2
    })
    const r = el.getBoundingClientRect()
    const hits = overlays.filter((o) => {
      const b = o.getBoundingClientRect()
      const left = Math.max(r.left, b.left)
      const right = Math.min(r.right, b.right)
      const top = Math.max(r.top, b.top)
      const bottom = Math.min(r.bottom, b.bottom)
      if (right - left <= 1 || bottom - top <= 1) return false
      const topmost = document.elementFromPoint((left + right) / 2, (top + bottom) / 2)
      return !!topmost && o.contains(topmost) && !el.contains(topmost)
    })
    const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40) || el.getAttribute('name') || el.id
    const by = hits.map((o) => `${o.tagName.toLowerCase()}.${String(o.className).split(' ').slice(0, 3).join('.')}`).join(', ')
    return { key, hit: hits.length ? `${el.tagName} "${name}" tapado por ${by} (top ${Math.round(r.top)}, bottom ${Math.round(r.bottom)}, vh ${window.innerHeight})` : '' }
  })
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

/**
 * Foco ya asentado en un diálogo: espera a que terminen sus animaciones (hoy no tiene; si se agrega una de
 * apertura, se espera) y registra durante `holdMs` cualquier cambio de foco. Devuelve los cambios vistos
 * y el elemento enfocado al final, para detectar lo que mueve el foco después de abrir, no solo al instante.
 */
export async function settledFocus(dialog: Locator, holdMs = 1000) {
  await dialog.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)))
  return dialog.page().evaluate(async (ms) => {
    const describe = (el: Element | null) => (el?.getAttribute('aria-label') ?? el?.textContent ?? String(el)).trim()
    const changes: string[] = []
    const onFocus = (event: FocusEvent) => changes.push(describe(event.target as Element))
    document.addEventListener('focusin', onFocus, true)
    await new Promise((resolve) => setTimeout(resolve, ms))
    document.removeEventListener('focusin', onFocus, true)
    return { changes, active: describe(document.activeElement) }
  }, holdMs)
}

/** true si el foco está dentro del <dialog open>. */
export function focusInsideOpenDialog(page: Page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('dialog[open]')
    return !!dialog && dialog.contains(document.activeElement)
  })
}
