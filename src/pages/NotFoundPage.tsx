import { notFound } from '@/content/notFound'
import { useAnchorFocus } from '@/lib/hooks/useAnchorFocus'
import { Button } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { Logo } from '@/components/atoms/Logo'
import { SkipLink } from '@/components/atoms/SkipLink'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'
import { ProjectNotice } from '@/components/organisms/ProjectNotice'

/**
 * Página 404: skip link → aviso (complementary) → header (banner) con la marca enlazada al inicio → <main>.
 * Sin barra móvil, formulario ni diálogos: scrollbar-gutter queda en auto y el aviso llega al borde.
 * La sirve 404.html (Netlify) y, como respaldo, main.tsx si el hosting manda una ruta desconocida a index.html.
 */
export function NotFoundPage() {
  useAnchorFocus()
  const { brand } = notFound

  return (
    <>
      <SkipLink href="#main">{notFound.skipLink}</SkipLink>
      <ProjectNotice />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-page items-center px-gutter py-4">
          <a href={notFound.homeHref} className="flex min-h-11 items-center text-text no-underline hover:text-text">
            <Logo name={brand.name} monogram={brand.monogram} tagline={brand.tagline} />
            <VisuallyHidden>{brand.homeSuffix}</VisuallyHidden>
          </a>
        </div>
      </header>

      {/* Sin tabIndex: el skip link lleva el foco al h1 (useAnchorFocus) */}
      <main id="main" className="mx-auto flex max-w-page flex-col items-start gap-6 px-gutter py-section">
        <Heading as="h1" size="display-l">
          {notFound.heading}
        </Heading>
        <p className="m-0 max-w-measure-lg font-sans text-body text-text-muted">{notFound.text}</p>
        <div className="flex flex-wrap gap-4">
          <Button href={notFound.primary.href}>{notFound.primary.label}</Button>
          <Button href={notFound.secondary.href} variant="secondary">
            {notFound.secondary.label}
          </Button>
        </div>
      </main>
    </>
  )
}
