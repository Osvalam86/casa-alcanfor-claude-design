import { useEffect, type RefObject } from 'react'

/**
 * Expone en <html> el alto del header compacto como --header-height (lo usa scroll-padding-top).
 * Mide la fila de contenido, que no cambia con la transición de padding, y le suma el padding
 * compacto del token: así el valor es el del estado compacto aunque la página esté arriba de todo.
 * ResizeObserver lo actualiza si la fila cambia (carga de fuentes, zoom, cambio de breakpoint).
 */
export function useHeaderHeight(rowRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const root = document.documentElement
    const update = () => {
      const pad = parseFloat(getComputedStyle(root).getPropertyValue('--header-pad-compact')) || 0
      root.style.setProperty('--header-height', `${row.getBoundingClientRect().height + 2 * pad}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(row)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--header-height')
    }
  }, [rowRef])
}
