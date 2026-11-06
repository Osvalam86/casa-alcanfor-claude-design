import { landing } from '@/content/landing'
import { GUESTS } from '@/lib/validation'
import { unsplashJpgUrl } from '@/lib/unsplash'

const { street, postalCode } = landing.location.addressParts

/**
 * Campos del JSON-LD que salen de datos de ejemplo (`// DEMO` en content/landing.ts). Calle y código
 * postal solo cuentan si existen: hoy el domicilio es solo «Zapopan, Jalisco».
 */
export const STRUCTURED_DATA_DEMO_FIELDS = [
  ...(street ? ['address.streetAddress'] : []),
  ...(postalCode ? ['address.postalCode'] : []),
  'telephone',
  'email',
]

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
    // Foto real del lugar (la del hero), en JPG y con URL absoluta; no la imagen OG, que es una maqueta
    image: unsplashJpgUrl(hero.image.id, 1200),
    address: {
      '@type': 'PostalAddress',
      // Opcionales: se omiten mientras el domicilio sea solo municipio y estado
      ...(address.street && { streetAddress: address.street }),
      ...(address.postalCode && { postalCode: address.postalCode }),
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
