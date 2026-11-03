import { landing } from '@/content/landing'
import { GUESTS } from '@/lib/validation'
import { unsplashUrl } from '@/lib/unsplash'

/** Campos del JSON-LD que salen de datos de ejemplo (`// DEMO` en content/landing.ts). */
export const STRUCTURED_DATA_DEMO_FIELDS = ['address.streetAddress', 'address.postalCode', 'telephone', 'email']

/**
 * JSON-LD EventVenue con los datos de content/landing.ts. Lo inyecta en index.html el plugin `seo` de
 * vite.config.ts. `url` y `@id` solo existen si hay dominio (VITE_SITE_URL).
 * Fuera a propósito mientras sean DEMO: aggregateRating (reseñas de ejemplo; Google penaliza reseñas
 * inventadas) y sameAs (las redes apuntan a URLs genéricas).
 */
export function structuredData(siteUrl: string) {
  const { brand, hero, location, footer, packages } = landing
  const address = location.addressParts
  const prices = packages.items.map((item) => item.price)

  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    ...(siteUrl && { '@id': `${siteUrl}/#venue`, url: `${siteUrl}/` }),
    name: brand.name,
    description: hero.lead,
    image: unsplashUrl(hero.image.id, 1200),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.street}, ${address.neighborhood}`, // DEMO
      postalCode: address.postalCode, // DEMO
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    telephone: footer.phone.href.replace('tel:', ''), // DEMO
    email: footer.email.href.replace('mailto:', ''), // DEMO
    maximumAttendeeCapacity: GUESTS.max,
    priceRange: `${prices[0]}–${prices[prices.length - 1]} MXN ${packages.suffix}`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: location.hoursSchema.days,
      opens: location.hoursSchema.opens,
      closes: location.hoursSchema.closes,
    },
  }
}
