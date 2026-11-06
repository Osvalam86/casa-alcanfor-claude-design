import { landing } from '@/content/landing'

/**
 * Copy de la página 404 (404.html y respaldo en el cliente). Contenido nuevo, fuera del diseño:
 * ver «Decisiones respecto al diseño» en el README. Rutas absolutas porque Netlify sirve la página
 * en cualquier ruta inexistente (/a/b/c), donde una ruta relativa apuntaría a otro lugar.
 */
export const notFound = {
  /** Mismo texto que el <title> de 404.html; el respaldo en el cliente lo aplica a index.html. */
  title: 'Página no encontrada · Casa Alcanfor',
  skipLink: landing.a11y.skipLink,
  brand: landing.brand,
  homeHref: '/',
  heading: 'No encontramos esta página',
  text: 'Puede que el enlace esté incompleto o que la página ya no exista.',
  primary: { href: '/', label: 'Volver al inicio' },
  secondary: { href: `/${landing.cta.contactHref}`, label: landing.cta.visit },
}
