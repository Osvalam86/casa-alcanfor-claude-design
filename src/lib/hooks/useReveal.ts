import { useEffect } from 'react'

/**
 * Reveal del diseño (fade + 16px, stagger 60ms): marca con data-revealed los [data-reveal]
 * que entran en pantalla. La animación vive en CSS y solo existe con prefers-reduced-motion: no-preference.
 */
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return

    const root = document.documentElement
    root.classList.add('js-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      root.classList.remove('js-reveal')
    }
  }, [])
}
