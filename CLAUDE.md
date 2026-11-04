# CLAUDE.md · Casa Alcanfor (landing)

Contexto y reglas del proyecto. Léelo completo antes de cualquier tarea y respétalo en todo el código que generes.

## 1. Stack (no cambiar sin preguntar)

- React 19 + TypeScript 6.0 (modo strict, `"strict": true` en `tsconfig.app.json` y `tsconfig.node.json`) + Vite
  - No subir a TypeScript 7 hasta que `typescript-eslint` lo soporte; hoy rompe `pnpm lint`.
- Tailwind CSS v4 con `@tailwindcss/vite` (sin `tailwind.config.js`; los tokens viven en CSS con `@theme`)
- Gestor de paquetes: **pnpm**. Nunca uses `npm` ni `yarn` y nunca generes `package-lock.json` ni `yarn.lock`.
- Dependencias permitidas sin preguntar: `clsx`, `tailwind-merge`, `class-variance-authority`, `motion`, `@axe-core/playwright`, `@playwright/test`.
- Cualquier otra dependencia: pregunta antes de instalarla y explica por qué.
- En la fase de QA puedes correr `pnpm exec playwright install chromium` sin preguntar (descarga el navegador de pruebas).

## 2. Origen del diseño

- El diseño llega desde Claude Design (handoff bundle o export HTML) y vive en la carpeta `design/` en la raíz. Es solo referencia: no se importa desde `src/` ni se modifica.
- **No reconstruyas desde cero:** usa el código del diseño como referencia y refactorízalo a la arquitectura de este documento.
- El copy, los colores, la tipografía y el espaciado del diseño son la fuente de verdad. No inventes contenido ni cambies textos.
- Si algo del diseño es ambiguo o rompe una regla de accesibilidad, anótalo en el reporte de la fase en lugar de decidir en silencio.

## 3. Arquitectura (Atomic Design)

```
src/
  styles/
    index.css          # @import "tailwindcss"; + @import de theme.css
    theme.css          # @theme con todos los tokens
  components/
    atoms/             # Button, Input, Label, Badge, Chip, Icon, Heading...
    molecules/         # FormField, EventTypeCard, PriceTag, AccordionItem...
    organisms/         # SiteHeader, Hero, PricingPackages, QuoteForm, SiteFooter...
    templates/         # LandingTemplate
  pages/
    LandingPage.tsx
    DesignSystemPage.tsx   # muestra tokens y componentes con todas sus variantes y estados
  content/
    landing.ts         # todo el copy en un objeto tipado, nunca hardcodeado en componentes
  lib/
    cn.ts              # helper clsx + tailwind-merge
  assets/
```

- Una carpeta por componente: `Button/Button.tsx` + `Button/index.ts`.
- Un organismo solo se compone de moléculas y átomos; una molécula solo de átomos.
- Los imports solo van hacia abajo: un nivel inferior nunca importa de uno superior (un átomo no importa moléculas, una molécula no importa organismos). Sin dependencias circulares.
- Alias de importación `@/` apuntando a `src/` (configúralo en `tsconfig` y `vite.config.ts`).

## 4. Tokens (Tailwind v4)

- Todos los tokens van en `src/styles/theme.css`, en 3 niveles: primitivos → semánticos → de componente cuando aplique.
  - **Primitivos** (paleta cruda, p. ej. `--sand-500`) en `:root`, fuera de `@theme`, para que no generen utilidades como `bg-sand-500`.
  - **Semánticos** en `@theme inline`, apuntando a los primitivos (`--color-surface: var(--sand-50);`). Solo estos generan clases.
  - **De componente** en `@theme inline` solo cuando un componente necesite un valor propio.
- Nombres semánticos en inglés: `--color-surface`, `--color-surface-alt`, `--color-surface-inverse`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border`, etc.
- Tipografía, espaciado (escala base 4), radios, sombras, duraciones y easings también como tokens.
- **Prohibido:** valores arbitrarios (`text-[#7A5C30]`, `p-[13px]`), colores en hex dentro de componentes y estilos inline. Si falta un valor, créalo como token.
- **Única excepción de estilo inline:** el parallax de la foto del hero (`Hero.tsx`), `style={{ y }}` en un `motion.img`. Es un valor dinámico de `motion` (un `MotionValue` que cambia con el scroll), no se puede expresar como clase y se omite con `prefers-reduced-motion: reduce`. No agregues otros `style=` sin preguntar.
- **Variable medida en JS:** `useHeaderHeight` escribe `--header-height` en `<html>` (`style.setProperty`) con el alto real del header compacto, medido con `ResizeObserver`. La consume `scroll-padding-top`. Es un valor que solo se conoce al renderizar; no lo uses de modelo para otros estilos.

## 5. Componentes

- Componentes funcionales con props tipadas mediante `type`. No uses `any`.
- Las variantes se definen con `cva`; las clases se combinan con `cn()`.
- Extiende las props nativas del elemento (`ComponentProps<'button'>`) y pasa el resto con `...props`.
- `ref` como prop (React 19), sin `forwardRef`.
- Estados obligatorios donde apliquen: default, hover, focus-visible, active, disabled, loading, error, success.
- Nada de lógica de negocio en átomos ni moléculas.

## 6. Accesibilidad (WCAG 2.2 AA, no negociable)

- HTML semántico primero: `header`, `nav` con `aria-label`, `main`, `section` con heading, `footer`. Usa `button` para acciones y `a` para navegación.
- Un solo `h1` y jerarquía de encabezados sin saltos.
- ARIA solo cuando no exista un elemento nativo. Accordion con `button` + `aria-expanded` + `aria-controls`.
- Foco visible en todo elemento interactivo (`focus-visible:` con un anillo de contraste ≥ 3:1). Nunca `outline-none` sin un reemplazo.
- Contraste: texto ≥ 4.5:1, texto grande y componentes de UI ≥ 3:1.
- Área táctil mínima de 24×24 px (44×44 px en controles principales de móvil).
- Formularios: `label` visible asociado, `autocomplete` correcto, errores ligados con `aria-describedby`, `aria-invalid` y un resumen de errores al enviar.
- Menú móvil, lightbox y modales: focus trap, cierre con `Escape` y el foco regresa al elemento que los abrió.
- Imágenes: `alt` descriptivo en las de contenido, `alt=""` en las decorativas.
- Skip link "Saltar al contenido" como primer elemento enfocable.
- Movimiento: respeta `prefers-reduced-motion` (con `motion-safe:`/`motion-reduce:` o `useReducedMotion`). Nada en autoplay sin control de pausa.
- Sin scroll horizontal a 320 px y funcional con zoom al 200%.

## 6.1 Skill obligatoria: semantic-markup

- Antes de escribir el JSX de cualquier átomo, molécula, organismo o template, aplica la skill `semantic-markup`.
- Orden: 1) estructura semántica y cableado accesible (IDs, label/for, aria-describedby, aria-labelledby) según la skill; 2) estilos con Tailwind y los tokens de theme.css.
- La skill no define clases ni estilos: esos siguen las secciones 4 y 5 de este documento.
- En el reporte de cada fase, indica en qué componentes la aplicaste y qué decisiones de marcado tomó.

## 7. Responsive

- Mobile first. Valida en 390, 768, 1024, 1280 y 1440 px.
- Contenedor máximo de 1280 px.
- El grid sigue al diseño: grids `auto-fit`/`auto-fill` con `minmax()` cuyos mínimos son tokens de `theme.css` (`--grid-min-*`). No se fuerza un grid de 4/8/12 columnas.
- Breakpoints: `sm` 600 px, `md` 768 px y `lg` 1024 px. El responsive se resuelve en CSS, nunca leyendo `window.innerWidth`.

## 7.1 Idioma, fuentes, SEO y formulario

- El sitio está en español de México: `<html lang="es-MX">`. Cualquier fragmento en otro idioma lleva su propio `lang`.
- Fuentes: `@fontsource/cormorant-garamond` (500, 600) y `@fontsource/manrope` (400–700), subset latin, importadas en `src/styles/fonts.css` con `font-display: swap`, más un `preload` de Cormorant 500 (la fuente del h1) en `index.html`. No cargues fuentes desde Google Fonts ni otro CDN.
- SEO: `title`, `meta description`, `theme-color`, íconos, `site.webmanifest`, Open Graph (`og:image` = `public/og-image.png`, 1200×630) y Twitter Card en `index.html`. Los textos salen del diseño; si faltan, anótalos como duda en lugar de inventarlos.
- JSON-LD `EventVenue`: lo arma `src/lib/structuredData.ts` con `content/landing.ts` y lo inyecta el plugin `seo` de `vite.config.ts`. Los campos DEMO se listan en un comentario junto al script. `aggregateRating` y `sameAs` quedan fuera mientras las reseñas y las redes sean de ejemplo.
- **Dominio (`VITE_SITE_URL`):** todo lo que depende del dominio sale de esta variable (ver `.env.example`; defínela en `.env.local` o en el entorno de deploy, sin `/` final). Con valor, el build agrega `canonical`, `og:url` y `url`/`@id` al JSON-LD, y vuelve absolutas `og:image` y `twitter:image`. Vacía, se omite todo eso y la imagen queda como ruta relativa.
- **noindex:** el sitio es un proyecto conceptual. Todas las páginas llevan `<meta name="robots" content="noindex">` y `netlify.toml` envía `X-Robots-Tag: noindex`. No se genera `sitemap.xml` ni la línea `Sitemap:` de `robots.txt`.
- Íconos: `pnpm icons` los regenera en `public/` desde el monograma del Logo (`scripts/generate-icons.ts`, con Playwright, sin dependencias nuevas).
- Portadas: `pnpm og` construye el sitio y genera dos imágenes de 1200×630 con capturas reales a 1440 y 390 px (`scripts/generate-og.ts`). `docs/cover.png` es la portada del README (caso de estudio, herramientas y WCAG); `public/og-image.png` es la de `og:image`/`twitter:image`, neutra para clientes: solo el negocio y «Proyecto conceptual», sin herramientas ni stack. Regénéralas cuando cambie la primera pantalla.
- `QuoteForm`: mientras no se defina un destino, el envío es simulado (validación completa + estados loading/success/error) detrás de una función `submitQuote` en `src/lib/`. No conectes servicios externos sin preguntar.

## 8. Flujo de trabajo y checkpoints

Trabaja por fases. **Detente solo en estos 4 checkpoints**; dentro de cada fase avanza sin pedir confirmación por componente.

1. **Plan (modo plan):** inventario Atomic Design, mapeo de tokens, árbol de archivos y lista de dudas. → Espera aprobación.
2. **Fundamentos:** `theme.css`, `cn.ts`, átomos y moléculas, y `DesignSystemPage` visible en localhost. → Espera aprobación.
3. **Página:** organismos, template y `LandingPage` completa con el copy de `content/landing.ts`. → Espera aprobación.
4. **QA:** `pnpm typecheck`, `pnpm lint`, `pnpm build`, auditoría con axe + Playwright en 390 y 1440 px. Corrige todo lo que falle y entrega un reporte.

Al cerrar cada fase entrega: qué hiciste, qué archivos tocaste, qué decisiones tomaste y qué queda pendiente.

## 9. Comandos

```
pnpm dev          # servidor local
pnpm build        # build de producción
pnpm lint         # ESLint (incluye eslint-plugin-jsx-a11y en modo strict)
pnpm typecheck    # tsc -b (revisa tsconfig.app.json, tsconfig.node.json y tsconfig.e2e.json vía references)
pnpm test:e2e     # Playwright + axe sobre el build (vite preview) a 390 y 1440 px
pnpm icons        # regenera favicon e íconos de public/ desde el monograma del Logo
pnpm og           # build + portada del README (docs/) e imagen para redes (public/) con capturas del sitio
```

Antes de dar por terminada una fase: `pnpm typecheck` y `pnpm lint` sin errores.

- `pnpm lint` corre `eslint-plugin-jsx-a11y` con `flatConfigs.strict` sobre los `.tsx`. En `settings['jsx-a11y']` los átomos están mapeados a su elemento nativo (`Button`/`IconButton` → `button`, `ShapedImage` → `img`, `TextLink`/`NavLink` → `a`, `Input`, `Select`, `Textarea`, `Label`) y `polymorphicPropName: 'as'`, así que las reglas también los revisan.
- Las reglas no ven props que llegan por spread: escribe `alt` y `children` explícitos (`photoProps()` no incluye `alt`).
- Excepciones acordadas sobre strict (en `eslint.config.js`): `<dialog>` puede llevar `onKeyDown`/`onKeyUp`/`onClick` (focus trap, flechas y clic en backdrop) y `role="tabpanel"` puede llevar `tabIndex` (patrón tabs de APG).
- No desactives ni relajes una regla de jsx-a11y sin preguntar.

## 10. No hacer

- No usar `npm` ni `yarn`.
- No usar `div` ni `span` como botones o enlaces.
- No hardcodear copy, colores ni medidas.
- No instalar librerías de UI (MUI, shadcn, Chakra, etc.) sin preguntar.
- No cambiar el diseño "para mejorarlo" sin preguntar: propón y espera.
- No borrar ni reescribir archivos fuera del alcance de la fase en curso.
