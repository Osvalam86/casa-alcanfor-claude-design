import type { Photo } from '@/lib/unsplash'
import type { IconName } from '@/components/atoms/Icon'

/**
 * Todo el copy de la landing, tomado de design/Casa Alcanfor Landing.dc.html.
 * DEMO: los valores marcados con `// DEMO` son de ejemplo y deben reemplazarse con datos reales (D4/D6).
 */

export const EVENT_TYPES = [
  'Boda',
  'XV años',
  'Bautizo o primera comunión',
  'Cumpleaños o aniversario',
  'Baby shower o graduación',
  'Evento corporativo',
] as const

export const GALLERY_FILTERS = ['Todos', 'Bodas', 'XV años', 'Bautizos', 'Corporativos'] as const
export type GalleryFilter = (typeof GALLERY_FILTERS)[number]
export type GalleryCategory = Exclude<GalleryFilter, 'Todos'>

export type GalleryPhoto = Photo & { category: GalleryCategory; ratio: 'portrait' | 'photo' | 'wide' }

/** Partes de la dirección: arman el texto visible y el PostalAddress del JSON-LD. */
const ADDRESS_PARTS = {
  street: 'Av. de los Alcanfores 1450', // DEMO
  neighborhood: 'Jardines del Valle', // DEMO
  postalCode: '45138', // DEMO
  locality: 'Zapopan',
  region: 'Jalisco',
  regionShort: 'Jal.',
  country: 'MX',
} as const
const ADDRESS = `${ADDRESS_PARTS.street}, ${ADDRESS_PARTS.neighborhood}, ${ADDRESS_PARTS.postalCode} ${ADDRESS_PARTS.locality}, ${ADDRESS_PARTS.regionShort}`
const ADDRESS_QUERY = `${ADDRESS_PARTS.street}, ${ADDRESS_PARTS.neighborhood}, ${ADDRESS_PARTS.locality}, ${ADDRESS_PARTS.region}`
const WHATSAPP_NUMBER = '523312345678' // DEMO

const portrait = (id: string, alt: string): Photo => ({ id, alt, width: 900, height: 1125 })
const photo = (id: string, alt: string): Photo => ({ id, alt, width: 900, height: 600 })
const wide = (id: string, alt: string): Photo => ({ id, alt, width: 1600, height: 900 })

export const landing = {
  a11y: {
    skipLink: 'Saltar al contenido',
    newWindow: ' (se abre en una ventana nueva)',
  },

  brand: {
    name: 'Casa Alcanfor',
    monogram: 'CA',
    tagline: 'Jardín & Salón',
    /** Se suma al texto visible del logo: el nombre accesible lo contiene (WCAG 2.5.3). */
    homeSuffix: ', inicio',
    motto: 'Celebraciones que se recuerdan',
  },

  nav: {
    label: 'Principal',
    links: [
      { href: '#eventos', label: 'Eventos' },
      { href: '#espacios', label: 'Espacios' },
      { href: '#paquetes', label: 'Paquetes' },
      { href: '#galeria', label: 'Galería' },
      { href: '#preguntas', label: 'Preguntas' },
    ],
    visit: 'Agenda tu visita',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menuTitle: 'Menú',
    menuNavLabel: 'Menú móvil',
  },

  cta: {
    availability: 'Consulta disponibilidad',
    visit: 'Agenda tu visita',
    visitGuided: 'Agenda una visita guiada',
    whatsapp: 'Escríbenos por WhatsApp',
    contactHref: '#contacto',
    whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero información para mi evento en Casa Alcanfor.')}`,
  },

  prefill: {
    visitIdea: 'Quiero agendar una visita guiada.',
    visitNote: 'Cuéntanos cuándo te gustaría visitarnos. Las visitas guiadas son de lunes a sábado, de 10:00 a 19:00.',
    packageIdea: (name: string) => `Me interesa el paquete ${name}.`,
    packageNote: (name: string) =>
      `Anotamos tu interés en el paquete ${name}. Completa tus datos y tu coordinador te envía la cotización.`,
    quickCheckNote: (tipo: string, fecha: string, invitados: number) =>
      `Anotamos tu ${tipo.toLowerCase()} para el ${fecha} con ${invitados} invitados. Completa tus datos y te confirmamos qué espacios están libres.`,
  },

  hero: {
    eyebrow: 'Jardín & Salón de eventos en Zapopan',
    titleStart: 'Celebra donde cada momento se vuelve ',
    titleEmphasis: 'recuerdo',
    lead: 'Bodas, XV años, bautizos y eventos que se viven sin preocupaciones. Espacios de ensueño, un coordinador contigo de principio a fin y precio cerrado desde el primer día.',
    tour: 'Recorre el salón',
    image: portrait('1607861884586-c7cfaed16290', 'Pasillo de ceremonia al aire libre iluminado entre sillas blancas'),
    detailImage: photo('1769812344099-8e52466aea8e', 'Detalle de mesa con flores blancas y velas'),
  },

  quickCheck: {
    title: 'Verifica tu fecha',
    tipo: { label: '¿Qué celebras?', placeholder: 'Elige' },
    fecha: { label: 'Fecha tentativa' },
    invitados: {
      label: 'Invitados',
      decrement: 'Quitar 10 invitados',
      increment: 'Sumar 10 invitados',
      initial: 120,
      /** Anuncio de la región viva tras + y − (el foco sigue en el botón, el lector no lee el campo). */
      valueText: (n: string) => `${n} invitados`,
    },
    submit: 'Ver fechas libres',
    note: 'Respuesta en menos de 2 horas en horario de oficina. Sin compromiso.',
    errors: {
      missing: 'Elige qué celebras y una fecha tentativa para ver fechas libres.',
      pastDate: 'Elige una fecha a partir de hoy.',
      guests: 'Escribe un número de invitados entre 10 y 450.',
    },
  },

  trust: {
    stats: [
      { value: '+1,200', label: 'eventos realizados' }, // DEMO
      { value: '450', label: 'Hasta 450 invitados' },
      { value: '4.9', star: true, label: 'en Google (320 reseñas)' }, // DEMO
    ],
    note: 'Cifras de ejemplo · demo',
  },

  events: {
    eyebrow: 'Para cada celebración',
    title: 'Un mismo lugar, mil maneras de celebrar',
    items: [
      {
        title: 'Bodas',
        description: 'El sí que soñaste, con jardín al atardecer y salón para la fiesta.',
        link: 'Ver ideas para bodas',
        filter: 'Bodas',
        photo: { id: '1704455305845-d5f66a560e6f', alt: 'Novios abrazados frente a una reja de hierro forjado', width: 1200, height: 1200 },
      },
      {
        title: 'XV años',
        description: 'Una noche a su medida, con pista, luces y el vals que siempre imaginó.',
        link: 'Ver ideas para XV años',
        filter: 'XV años',
        photo: photo('1714972383570-44ddc9738355', 'Pareja bailando en la pista iluminada del salón'),
      },
      {
        title: 'Bautizos y primeras comuniones',
        description: 'Reuniones familiares cálidas, cómodas para todas las edades.',
        link: 'Ver ideas para bautizos',
        filter: 'Bautizos',
        photo: photo('1561593367-66c79c2294e6', 'Mesa montada con vajilla blanca para una comida familiar'),
      },
      {
        title: 'Cumpleaños y aniversarios',
        description: 'Brinda por los años vividos con quienes más quieres.',
        link: 'Ver ideas para cumpleaños',
        filter: 'Todos',
        photo: photo('1527529482837-4698179dc6ce', 'Invitados levantando sus copas en un brindis'),
      },
      {
        title: 'Baby shower y graduaciones',
        description: 'Celebraciones a medio día con menús ligeros y ambiente relajado.',
        link: 'Ver ideas para baby shower',
        filter: 'Todos',
        photo: photo('1786550765782-64143480ba12', 'Jardín con luces colgantes entre los árboles durante el día'),
      },
      {
        title: 'Corporativos',
        description: 'Cenas de fin de año, lanzamientos y convenciones con soporte técnico incluido.',
        link: 'Ver ideas para corporativos',
        filter: 'Corporativos',
        photo: photo('1587825140708-dfaf72ae4b04', 'Ponente en escenario frente a un auditorio lleno'),
      },
    ] satisfies { title: string; description: string; link: string; filter: GalleryFilter; photo: Photo }[],
  },

  value: {
    title: 'Tú disfrutas, nosotros nos encargamos',
    image: portrait('1707333514312-39cf7658479c', 'Salón montado con mesas y sillas vestidas en blanco'),
    stat: { value: '14', label: 'años de experiencia · demo' }, // DEMO
    features: [
      { icon: 'grid', title: 'Todo en un solo lugar', description: 'Banquete, mobiliario, iluminación, audio y montaje en un paquete.' },
      { icon: 'user', title: 'Un coordinador para ti', description: 'Una persona que conoce tu evento y responde tus dudas desde la primera visita hasta el último invitado.' },
      { icon: 'tag', title: 'Precio cerrado, sin sorpresas', description: 'Lo que cotizas es lo que pagas. Sin cargos ocultos al final.' },
      { icon: 'plus-circle', title: 'Pensado para todos', description: 'Estacionamiento con valet, rampas, elevador y baños accesibles.' },
    ] satisfies { icon: IconName; title: string; description: string }[],
    rating: '4.9 en Google · 320 reseñas', // DEMO
    ratingLabel: '5 de 5 estrellas',
  },

  spaces: {
    eyebrow: 'Espacios combinables',
    title: 'Tres espacios que se adaptan a tu celebración',
    tablistLabel: 'Espacios de Casa Alcanfor',
    items: [
      {
        name: 'Salón Gran Alcanfor',
        capacity: 'Hasta 450 invitados',
        description: 'Techos altos, candiles de cristal y una pista lista para no parar de bailar.',
        photo: wide('1723832348105-2e69f948135a', 'Salón Gran Alcanfor montado para banquete con mesas vestidas'),
        specs: [
          { term: 'Capacidad', value: 'Hasta 450 invitados' },
          { term: 'Superficie', value: '620 m²' },
          { term: 'Clima', value: 'Climatizado' },
          { term: 'Pista', value: '80 m²' },
        ],
      },
      {
        name: 'Jardín Los Fresnos',
        capacity: 'Hasta 300 invitados',
        description: 'Ceremonias al aire libre entre árboles centenarios, con plan de lluvia garantizado.',
        photo: wide('1526092817387-8f07b2904e48', 'Glorieta del Jardín Los Fresnos iluminada con series de luces'),
        specs: [
          { term: 'Capacidad', value: 'Hasta 300 invitados' },
          { term: 'Superficie', value: '900 m²' },
          { term: 'Cubierta', value: 'Carpa disponible' },
          { term: 'Lluvia', value: 'Plan garantizado' },
        ],
      },
      {
        name: 'Terraza Mirador',
        capacity: 'Hasta 120 invitados',
        description: 'Ideal para cocteles, cenas íntimas y celebraciones de tarde.',
        photo: wide('1781004896692-e662dc20fe24', 'Pérgola de la Terraza Mirador con luces colgantes'),
        specs: [
          { term: 'Capacidad', value: 'Hasta 120 invitados' },
          { term: 'Superficie', value: '210 m²' },
          { term: 'Vista', value: 'Al atardecer' },
          { term: 'Acceso', value: 'Con elevador' },
        ],
      },
    ],
  },

  packages: {
    eyebrow: 'Paquetes todo incluido',
    title: 'Paquetes claros para planear con tranquilidad',
    lead: 'Precios por invitado con IVA incluido. Personaliza cualquier paquete con tu coordinador.',
    prefix: 'Desde',
    suffix: 'por invitado',
    cta: 'Cotiza este paquete',
    items: [
      { name: 'Esencial', price: '$690', features: ['Banquete a 3 tiempos', 'Mobiliario estándar', 'Mantelería', 'Audio básico', '5 horas de evento'] },
      { name: 'Celebración', price: '$950', highlighted: true, badge: 'Más elegido', features: ['Banquete a 4 tiempos', 'Mobiliario premium', 'Iluminación ambiental', 'DJ', 'Coordinador dedicado', '6 horas de evento'] },
      { name: 'Gran Gala', price: '$1,350', features: ['Banquete gourmet', 'Barra libre nacional', 'Decoración floral base', 'Pista iluminada', 'DJ y animación', '7 horas de evento'] },
    ] satisfies { name: string; price: string; highlighted?: boolean; badge?: string; features: string[] }[],
    footnote: 'Precios de referencia para 2027. Pueden variar según fecha y número de invitados.',
  },

  process: {
    eyebrow: 'Cómo funciona',
    title: 'Así de fácil es reservar tu fecha',
    steps: [
      { number: '01', srPrefix: 'Paso 1: ', title: 'Cuéntanos tu idea', description: 'Elige fecha, tipo de evento e invitados.' },
      { number: '02', srPrefix: 'Paso 2: ', title: 'Visita Casa Alcanfor', description: 'Recorre los espacios y prueba el menú con tu coordinador.' },
      { number: '03', srPrefix: 'Paso 3: ', title: 'Aparta tu fecha', description: 'Asegúrala con un anticipo del 20% y paga el resto en mensualidades.' },
      { number: '04', srPrefix: 'Paso 4: ', title: 'Celebra', description: 'Llega, disfruta y deja todo lo demás en nuestras manos.' },
    ],
  },

  gallery: {
    eyebrow: 'Galería',
    title: 'Momentos que ya sucedieron aquí',
    filtersLabel: 'Filtrar galería por tipo de evento',
    count: (n: number, filter: GalleryFilter) => `${n} ${n === 1 ? 'foto' : 'fotos'}${filter === 'Todos' ? '' : ` de ${filter}`}`,
    openLabel: (alt: string) => `Ampliar foto: ${alt}`,
    photos: [
      { ...portrait('1635362926140-4491578be6ba', 'Novia sosteniendo su ramo de flores'), category: 'Bodas', ratio: 'portrait' },
      { ...photo('1592318072094-2694c98adb73', 'Candil de cristal encendido sobre la pista del salón'), category: 'XV años', ratio: 'photo' },
      { ...wide('1768508950719-4d76978fdf44', 'Cena formal de empresa con centros de mesa florales'), category: 'Corporativos', ratio: 'wide' },
      { ...portrait('1758705477576-8783430d55b6', 'Mesa decorada con vela encendida y flores'), category: 'Bautizos', ratio: 'portrait' },
      { ...photo('1543932927-a9def13a0e7c', 'Novio besando la frente de la novia'), category: 'Bodas', ratio: 'photo' },
      { ...portrait('1648154164366-d067faecdc51', 'Baile en la pista durante la fiesta'), category: 'XV años', ratio: 'portrait' },
      { ...wide('1549997966-5dd46b8e2b06', 'Pareja bajo un árbol iluminado de noche'), category: 'Bodas', ratio: 'wide' },
      { ...photo('1519225421980-715cb0215aed', 'Copas de cristal sobre mesa montada para comida familiar'), category: 'Bautizos', ratio: 'photo' },
      { ...portrait('1540575467063-178a50c2df87', 'Auditorio montado para conferencia con invitados sentados'), category: 'Corporativos', ratio: 'portrait' },
      { ...portrait('1511795409834-ef04bbd61622', 'Mesa elegante con centro floral'), category: 'Bodas', ratio: 'portrait' },
      { ...portrait('1595407753234-0882f1e77954', 'Novios tomados de la mano junto a un muro de madera'), category: 'Bodas', ratio: 'portrait' },
      { ...photo('1502635385003-ee1e6a1a742d', 'Copas de vino alineadas sobre mesa de banquete'), category: 'Corporativos', ratio: 'photo' },
    ] satisfies GalleryPhoto[],
  },

  lightbox: {
    galleryLabel: 'Galería de fotos',
    tourLabel: 'Recorrido por los espacios',
    counter: (i: number, n: number) => `${i} de ${n}`,
    close: 'Cerrar',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
  },

  testimonials: {
    title: 'Lo que dicen quienes ya celebraron con nosotros',
    rating: '4.9', // DEMO
    ratingNote: '320 reseñas en Google · demo', // DEMO
    ratingLabel: '5 de 5 estrellas',
    featured: {
      quote: 'Desde la primera visita supimos que era aquí. Nuestro coordinador estuvo en cada detalle y no tuvimos que preocuparnos por nada.',
      author: 'Andrea y Luis',
      initials: 'AL',
      meta: 'Boda, 280 invitados',
      photo: photo('1583939003579-730e3918a45a', 'Andrea y Luis besándose el día de su boda'),
    },
    items: [
      { quote: '“Los XV de mi hija fueron perfectos. Puntuales, atentos y la comida fue lo más comentado.”', author: 'Mariana G.', initials: 'MG', meta: 'XV años' },
      { quote: '“Organizamos nuestra cena anual para 400 personas y la logística fue impecable.”', author: 'Rodrigo P.', initials: 'RP', meta: 'Evento corporativo' },
    ],
  },

  ctaBanner: {
    title: 'Tu fecha puede estar disponible hoy',
    lead: 'Los sábados de temporada alta se reservan con meses de anticipación. Consulta sin compromiso.',
  },

  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Resolvemos tus dudas',
    lead: '¿No encuentras tu respuesta? Tu coordinador te contesta por WhatsApp.',
    items: [
      { q: '¿Con cuánto tiempo debo reservar?', a: 'Para sábados de temporada alta (marzo a mayo y octubre a diciembre) te recomendamos de 10 a 12 meses. Para viernes, domingos y eventos de día, de 3 a 6 meses suele ser suficiente.' },
      { q: '¿Qué incluye exactamente cada paquete?', a: 'Banquete, mobiliario, mantelería, audio y horas de evento según el nivel. Celebración suma iluminación, DJ y coordinador dedicado; Gran Gala agrega barra libre nacional y decoración floral base. Recibes la lista completa por escrito antes de apartar.' },
      { q: '¿Puedo traer mi propio proveedor de pastel, flores o música?', a: 'Sí. Solo pedimos que tu proveedor se registre con tu coordinador al menos 15 días antes para coordinar horarios de montaje y acceso.' },
      { q: '¿Qué pasa si llueve el día de mi evento en el jardín?', a: 'Tienes plan de lluvia garantizado: carpa para el Jardín Los Fresnos o cambio al salón sin costo. Lo decides con tu coordinador 48 horas antes.' },
      { q: '¿Cómo son los pagos y qué pasa si necesito cambiar la fecha?', a: 'Apartas con 20% de anticipo y pagas el resto en mensualidades hasta 30 días antes del evento. Puedes cambiar la fecha una vez sin costo si avisas con 90 días de anticipación, sujeto a disponibilidad.' },
      { q: '¿Hay opciones vegetarianas, veganas o para alergias?', a: 'Sí. Todos los menús tienen opción vegetariana y vegana, y adaptamos platillos para alergias e intolerancias. Lo defines en tu prueba de menú.' },
      { q: '¿Facturan para empresas?', a: 'Sí, emitimos factura CFDI 4.0 a personas físicas y morales. Solo necesitamos tu constancia de situación fiscal al apartar la fecha.' },
      { q: '¿El lugar es accesible para personas con movilidad reducida?', a: 'Sí. Hay rampas en todos los accesos, baños accesibles, elevador a la Terraza Mirador y lugares de estacionamiento reservados junto a la entrada, además de valet para 180 autos.' },
    ],
  },

  contact: {
    eyebrow: 'Cotización y visitas',
    title: 'Platiquemos de tu evento',
  },

  quoteForm: {
    instructions: 'Todos los campos son obligatorios, salvo los marcados como opcionales.',
    fields: {
      name: { label: 'Nombre completo' },
      wa: { label: 'WhatsApp', helper: '10 dígitos, por ejemplo 33 1234 5678' },
      email: { label: 'Correo' },
      tipo: { label: 'Tipo de evento', placeholder: 'Elige una opción' },
      fecha: { label: 'Fecha tentativa' },
      inv: { label: 'Número de invitados', helper: 'Hasta 450 invitados' },
      idea: { label: 'Cuéntanos tu idea', optional: '(opcional)' },
    },
    errors: {
      name: 'Escribe tu nombre completo.',
      wa: 'Escribe un número de WhatsApp de 10 dígitos.',
      email: 'Escribe un correo con el formato nombre@correo.com.',
      tipo: 'Elige el tipo de evento que celebras.',
      fecha: 'Elige una fecha a partir de hoy.',
      inv: 'Escribe un número de invitados entre 10 y 450.',
    },
    summaryTitle: (n: number) => (n === 1 ? 'Revisa 1 campo para enviar tu solicitud' : `Revisa ${n} campos para enviar tu solicitud`),
    submit: 'Enviar solicitud',
    submitting: 'Enviando…',
    privacyStart: 'Usamos tus datos solo para responder tu solicitud. Consulta nuestro ',
    privacyLink: 'aviso de privacidad',
    privacyEnd: '.',
    privacyHref: '/aviso-de-privacidad',
    success: {
      title: (firstName: string) => `¡Listo, ${firstName}! Recibimos tu solicitud.`,
      body: 'Tu coordinador te escribirá por WhatsApp en menos de 2 horas hábiles.',
      reset: 'Enviar otra solicitud',
    },
  },

  location: {
    label: 'Ubicación y contacto',
    mapTitle: 'Mapa de ubicación de Casa Alcanfor',
    mapSrc: `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&z=15&output=embed`,
    addressTerm: 'Dirección',
    address: ADDRESS,
    addressParts: ADDRESS_PARTS,
    addressDemo: '(demo)',
    directions: 'Cómo llegar',
    directionsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`,
    hoursTerm: 'Horarios de visita',
    hours: 'Lunes a sábado, de 10:00 a 19:00',
    /** El mismo horario en formato schema.org (JSON-LD). */
    hoursSchema: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' },
    talk: '¿Prefieres hablar?',
  },

  footer: {
    explore: 'Explora',
    exploreLabel: 'Pie de página',
    contact: 'Contacto',
    phone: { label: '33 1234 5678', href: 'tel:+523312345678' }, // DEMO
    email: { label: 'hola@casaalcanfor.mx', href: 'mailto:hola@casaalcanfor.mx' }, // DEMO
    city: 'Zapopan, Jalisco',
    social: 'Síguenos',
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com' }, // DEMO: URL genérica
      { label: 'Facebook', href: 'https://facebook.com' }, // DEMO: URL genérica
      { label: 'TikTok', href: 'https://tiktok.com' }, // DEMO: URL genérica
    ],
    copyright: '© 2026 Casa Alcanfor',
    privacy: { label: 'Aviso de privacidad', href: '/aviso-de-privacidad' },
  },
} as const
