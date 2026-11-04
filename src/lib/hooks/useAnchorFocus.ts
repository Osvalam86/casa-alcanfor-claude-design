import { useEffect } from 'react'

/**
 * Encabezado que recibe el foco al llegar a un destino del documento: el propio elemento si es un
 * encabezado o, si no, su primer h1/h2 (el h1 del hero para #main, el h2 de cada sección).
 * Así NVDA anuncia el título de la sección en lugar de leer la sección entera de corrido.
 */
export function headingTarget(target: Element): HTMLElement | null {
  const heading = target.matches('h1, h2') ? target : target.querySelector('h1, h2')
  return heading instanceof HTMLElement ? heading : null
}

/** Enfoca el encabezado sin desplazar: el scroll ya lo resolvió el ancla (y scroll-padding-top). */
export function focusHeading(target: Element) {
  const heading = headingTarget(target)
  if (!heading) return false
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
  return true
}

/**
 * Enlaces internos (#main, #eventos…): deja el salto nativo, que respeta scroll-padding-top y
 * scroll-behavior, y después mueve el foco al encabezado del destino. Los enlaces que ya manejan
 * su propio clic (preventDefault: menú móvil, resumen de errores, "Agenda tu visita") se respetan.
 */
export function useAnchorFocus() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const id = link?.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(decodeURIComponent(id)) : null
      if (!target) return
      // Después del salto nativo, que ocurre al terminar el despacho del clic
      requestAnimationFrame(() => focusHeading(target))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
