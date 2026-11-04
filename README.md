# Casa Alcanfor · Landing de un jardín de eventos, de Claude Design a React

Caso de estudio de maquetación y accesibilidad: la landing de un jardín y salón de eventos en Zapopan, generada con Claude Design y llevada a React, TypeScript y Tailwind CSS v4. El negocio es ficticio y es la excusa. Lo que se demuestra es convertir un prototipo de un solo archivo (estilos inline, hex sueltos y responsive resuelto con JS) en un sistema de tokens y componentes Atomic Design, documentar cada cambio respecto al diseño y construir lo que el prototipo no resolvía: teclado, foco, diálogos, formularios y lectores de pantalla.

**Demo:** pendiente de publicar en Netlify (`https://<sitio>.netlify.app`) · catálogo de componentes en `/design-system.html`

**Diseño:** generado con [Claude Design](https://claude.ai) a partir de un brief propio. El export está en [`design/`](design/) como referencia: no se importa desde `src/` ni se modifica. No incluye `support.js`, el runtime de Claude Design, así que el `.dc.html` se lee como código pero no se abre como prototipo.

[![La landing de Casa Alcanfor en un escritorio y en un teléfono: el titular «Celebra donde cada momento se vuelve recuerdo», la franja de proyecto conceptual y la foto nocturna de un pasillo de ceremonia con luces colgantes. Texto: Caso de estudio. Casa Alcanfor. Un diseño de Claude Design llevado a React y Tailwind CSS v4. WCAG 2.2 AA como objetivo · Proyecto conceptual. Osvaldo Ocampo.](public/og-image.png)](public/og-image.png)

---

## Qué demuestra

- **Del prototipo al sistema.** El copy, los colores, la tipografía y el espaciado del diseño se conservan, pero pasan a tokens en [`theme.css`](src/styles/theme.css) en 3 niveles: primitivos en `:root` (no generan clases), semánticos en `@theme inline` (lo único que leen los componentes) y de componente cuando hace falta. Sin valores arbitrarios ni hex en los componentes.
- **Atomic Design estricto.** 27 átomos, 11 moléculas, 21 organismos y 1 template, una carpeta por componente, variantes con `cva` y los imports siempre hacia abajo. Todo el copy vive en [`content/landing.ts`](src/content/landing.ts), tipado.
- **Accesibilidad implementada.** Objetivo WCAG 2.2 AA: skip link, landmarks con nombre, `<dialog>` con focus trap y regreso del foco, tabs con roving tabindex, acordeón con `aria-expanded`, formulario con resumen de errores y `prefers-reduced-motion` respetado.
- **Marcado primero, estilos después.** Antes del JSX de cada componente se aplicó la skill `semantic-markup` del autor: elemento nativo, cableado de IDs (`label`/`for`, `aria-describedby`, `aria-labelledby`) y ARIA solo donde no hay elemento nativo.
- **Responsive en CSS.** Mobile first, breakpoints `sm` 600, `md` 768 y `lg` 1024, contenedor de 1280 px y grids `auto-fit` con mínimos tokenizados. Nada lee `window.innerWidth`.
- **Reglas que se comprueban por comando.** ESLint con `jsx-a11y` en modo strict (con los átomos mapeados a su elemento nativo) y una suite de Playwright + axe sobre el build de producción.

---

## Decisiones respecto al diseño

Las decisiones D1–D12 y los ajustes de accesibilidad se aprobaron en el plan de la Fase 1. Estas son las que cambian algo visible o de comportamiento:

| ID | Elemento | Diseño | Código | Motivo |
|---|---|---|---|---|
| D1 | Fuentes | Google Fonts por CDN | `@fontsource` local (Cormorant Garamond 500 y 600, Manrope 400–700), `font-display: swap` y `preload` de la fuente del `h1` | Sin terceros en la carga y sin parpadeo del título |
| D2 | Grids | Columnas calculadas en JS | `auto-fit` con `minmax()` y mínimos como tokens | Se reacomodan solos en cualquier ancho |
| D8 | Fotos | `background-image` | `<img>` con `alt`, `srcset`, `width` y `height` | Texto alternativo (1.1.1) y sin saltos de layout |
| A11y #2 | Calificaciones | Estrellas `★` como texto | Estrellas ocultas + «5 de 5 estrellas» solo para lectores | El lector no lee «estrella» cinco veces |
| A11y #8 | Galería | `grid-auto-flow: dense` | Sin `dense` | El orden visual coincide con el del DOM y del foco (1.3.2, 2.4.3) |
| A11y #11 | Responsive | `matchMedia` e `innerWidth` en JS | Media queries y container queries | Funciona sin JS de layout y con zoom al 200 % |
| A11y #6 | Envío del formulario | — | `aria-disabled` mientras carga, en lugar de `disabled` | El botón conserva el foco |
| A11y #7 | Diálogos | — | `inert` en el resto de la página y bloqueo del scroll | El lector no sale del diálogo |
| D7 | «Recorre el salón» | Abre un «recorrido en video» que es una sola foto con ícono de reproducir | Abre los 3 espacios en el lightbox, con ícono de galería y contador | No prometer un video que no existe |
| D9 | Enlace «Design System» del footer | Visible en la landing | Retirado; el catálogo solo se abre por su URL | Es una herramienta interna, no contenido del sitio |
| D12 | «Ver fechas libres» y formulario | — | Validación completa con envío simulado | No hay backend ni destino definido |
| — | Aviso de proyecto conceptual | No existe | Franja no fija antes del header, contraste 8.02:1 | Dejar claro que negocio, datos y reseñas son ficticios |

---

## Stack tecnológico

**Estructura**

![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Estilos y movimiento**

![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) ![class-variance-authority](https://img.shields.io/badge/cva-1E1A17?style=for-the-badge)

**Accesibilidad y pruebas**

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white) ![axe-core](https://img.shields.io/badge/axe--core-663399?style=for-the-badge) ![jsx-a11y](https://img.shields.io/badge/jsx--a11y-4B32C3?style=for-the-badge)

**Build y herramientas**

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

**Diseño y desarrollo asistido**

![Claude Design](https://img.shields.io/badge/Claude%20Design-D97757?style=for-the-badge&logo=claude&logoColor=white) ![Claude Code](https://img.shields.io/badge/Claude%20Code-D97757?style=for-the-badge&logo=claude&logoColor=white)

**Despliegue**

![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Control de versiones**

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## Accesibilidad

El objetivo es **WCAG 2.2 AA**. Este README no afirma conformidad: dice qué se probó, cómo y qué queda abierto.

**Automático.** `pnpm test:e2e` construye el sitio y lo prueba con `vite preview`, nunca contra el servidor de desarrollo, en Chromium (Playwright 1.64.1) a 390 y 1440 px. Resultado al cierre: **53 casos pasan y 7 se omiten a propósito** (los que solo aplican a un ancho, como el menú móvil en escritorio).

- **axe-core 4.14.0** con las reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` y `best-practice` en `/` y `/design-system.html`, a los dos anchos: 0 violaciones de cualquier impacto, incluida `region` (todo el contenido vive en landmarks).
- **Teclado:** el skip link es el primer enfocable y lleva a `<main>`; menú móvil y lightbox atrapan Tab, cierran con Escape y devuelven el foco; tabs de espacios con flechas, Inicio y Fin; FAQ con Enter y Espacio; el formulario vacío lleva el foco al resumen de errores y cada enlace al campo.
- **Foco no tapado (2.4.11):** ningún elemento enfocado queda bajo el header, la barra móvil ni el botón de WhatsApp.
- **Anclas:** cada sección queda justo bajo el header, desde arriba y con la página ya desplazada.
- **Reflow:** sin scroll horizontal a 320 y 640 px, y con zoom al 200 %.
- **Movimiento:** con `prefers-reduced-motion: reduce` se desactivan el reveal, el parallax y las transiciones.
- **Anuncios:** el NumberStepper anuncia el nuevo valor en una región viva; el logo tiene un nombre accesible que empieza con el texto visible (2.5.3).

**Contraste calculado** desde los hex de `theme.css` (fórmula de WCAG, no medido sobre el render): texto sobre el fondo principal 15.51:1, texto secundario 8.83:1, acento y enlaces 5.54:1, bordes de controles 3.76:1 y la franja de aviso 8.02:1.

**Queda abierto:**

- axe corre sobre la página cargada, no con los diálogos abiertos ni con el formulario en estado de error.
- Sin pruebas manuales documentadas con lector de pantalla (NVDA, VoiceOver, TalkBack) ni con alto contraste de Windows.
- Solo Chromium: Firefox y Safari sin probar.

---

## Alcance y límites

- **Contenido ficticio.** Ver Créditos. Todo el sitio lleva `noindex` (meta y cabecera `X-Robots-Tag`) para que no se confunda con un negocio real, y por eso no se genera `sitemap.xml`.
- **Sin backend.** «Ver fechas libres» y el formulario de cotización validan y simulan el envío (`src/lib/submitQuote.ts`): no hay petición de red y los datos no se guardan.
- **Aviso de privacidad solo como texto.** El formulario y el footer lo mencionan, pero no hay página ni enlace.
- **JSON-LD con datos de ejemplo.** `EventVenue` se genera desde `content/landing.ts`; `aggregateRating` y `sameAs` quedan fuera mientras reseñas y redes sean de ejemplo.
- **Fotos por URL de Unsplash**, no alojadas en el repo: dependen de su CDN.
- **Imagen OG relativa sin dominio.** Open Graph pide una URL absoluta: hasta definir `VITE_SITE_URL`, `og:image` es `/og-image.png` y las redes pueden no mostrarla.

---

## Inicio rápido

Requisitos: Node 26 y pnpm 11 (las versiones con las que se construyó y probó).

```bash
git clone https://github.com/Osvalam86/casa-alcanfor-claude-design.git
cd casa-alcanfor-claude-design
pnpm install
pnpm dev
```

Abre <http://localhost:5173>. Para las pruebas, descarga primero el navegador: `pnpm exec playwright install chromium`.

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo de Vite en `localhost:5173` |
| `pnpm build` | Comprueba los tipos (`tsc -b`) y genera `dist/` |
| `pnpm typecheck` | `tsc -b` sobre la app, la config de Node y las pruebas |
| `pnpm lint` | ESLint con `jsx-a11y` en modo strict |
| `pnpm test:e2e` | Build + Playwright y axe a 390 y 1440 px |
| `pnpm icons` | Regenera el favicon y los íconos de `public/` desde el monograma del logo |
| `pnpm og` | Construye el sitio y genera `public/og-image.png` con capturas reales a 1440 y 390 px |
| `pnpm preview` | Sirve `dist/` en `localhost:4173` |

**Variables de entorno.** `VITE_SITE_URL` es el dominio público, sin `/` final (ver [`.env.example`](.env.example)). Con valor, el build agrega `canonical`, `og:url` y `url`/`@id` al JSON-LD, y vuelve absolutas `og:image` y `twitter:image`; vacía, omite todo eso. En local va en `.env.local` (ignorado por git).

**Netlify.** [`netlify.toml`](netlify.toml) define el build (`pnpm build`, publica `dist/`), Node 26, pnpm 11, la cabecera `noindex` y la caché inmutable de `/assets`. `VITE_SITE_URL` se define en **Site configuration → Environment variables** del sitio en Netlify, no en el repo. No hay redirecciones: es una sola página con anclas.

---

## Estructura del proyecto

```text
casa-alcanfor-claude-design/
├── src/
│   ├── components/
│   │   ├── atoms/          # 27: Button, Input, Icon, Heading, ShapedImage, SkipLink…
│   │   ├── molecules/      # 11: FormField, PackageCard, AccordionItem, ErrorSummary…
│   │   ├── organisms/      # 21: SiteHeader, Hero, QuoteForm, Lightbox, ProjectNotice…
│   │   └── templates/      # LandingTemplate
│   ├── pages/              # LandingPage y DesignSystemPage
│   ├── content/            # landing.ts y designSystem.ts: todo el copy, tipado
│   ├── lib/                # cn, validación, envío simulado, JSON-LD, Unsplash y hooks
│   └── styles/             # theme.css (tokens), fonts.css e index.css
├── e2e/                    # Playwright + axe: anclas, teclado, layout y auditoría
├── design/                 # export de Claude Design (sin su runtime), solo referencia
├── public/                 # íconos, imagen OG, site.webmanifest y robots.txt
├── scripts/                # generate-icons.ts (pnpm icons) y generate-og.ts (pnpm og)
├── CLAUDE.md               # reglas del proyecto: stack, tokens, arquitectura y accesibilidad
├── netlify.toml            # build, cabeceras y caché
└── vite.config.ts          # alias @/, dos entradas y plugin de SEO
```

---

## Créditos

**Origen.** El diseño se generó con Claude Design a partir de un brief propio. El código lo construyó Claude Code bajo la dirección del autor, con sus reglas ([CLAUDE.md](CLAUDE.md)) y su skill `semantic-markup`.

**Fotos.** 24 fotos de [Unsplash](https://unsplash.com), cargadas desde su CDN, bajo la [Licencia de Unsplash](https://unsplash.com/license): uso libre, sin atribución obligatoria. El código solo guarda el identificador de cada imagen en el CDN, y ni ese identificador ni los metadatos de la imagen dicen quién la tomó, así que el crédito queda general.

**Fuentes.** [Cormorant Garamond](https://fontsource.org/fonts/cormorant-garamond) y [Manrope](https://fontsource.org/fonts/manrope), servidas desde el propio sitio con [Fontsource](https://fontsource.org), ambas bajo la [SIL Open Font License 1.1](https://openfontlicense.org).

**Íconos.** Set SVG de trazo propio, dibujado en el diseño de Claude Design y reescrito como el átomo `Icon`; no proviene de una librería de terceros. El ícono de WhatsApp representa una marca de su dueño y solo enlaza al chat.

**Mapa.** Embebido de Google Maps, sujeto a los términos de Google.

**Contenido ficticio.**

- El negocio Casa Alcanfor y su dirección, teléfono y WhatsApp (33 0000 0000), correo (`hola@casaalcanfor.example`, dominio reservado) y redes, marcados `// DEMO` en `content/landing.ts`.
- Las cifras: eventos realizados, años de experiencia y la calificación de 4.9 con 320 reseñas en Google.
- Los testimonios y sus autores, los paquetes y sus precios.

---

## Autor y licencia

**Osvaldo Ocampo** · [LinkedIn](https://www.linkedin.com/in/osvaldo-ocampo) · [GitHub](https://github.com/Osvalam86)

Construido con asistencia de herramientas de IA; las decisiones, la revisión del código y las pruebas son del autor.

- **Código y documentación:** MIT ([LICENSE](LICENSE)).
- **Fuera de la licencia MIT,** con la licencia de su autor: las fotos de Unsplash, las fuentes Cormorant Garamond y Manrope (OFL 1.1), el embebido de Google Maps, las marcas de terceros y las dependencias.
