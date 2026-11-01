import { landing } from '@/content/landing'
import { Logo } from '@/components/atoms/Logo'
import { NavLink } from '@/components/atoms/NavLink'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

const columnTitle = 'm-0 mb-2 font-sans text-overline font-semibold uppercase text-accent-inverse'

/**
 * <footer> hijo de <body> → landmark contentinfo. Los títulos de columna son <h2> (estructura real,
 * no solo estilo). Solo "Explora" es <nav>; contacto y redes son listas simples.
 * Sin enlace al Design System (D9): esa página solo es accesible por su URL.
 */
export function SiteFooter() {
  const { footer, brand, a11y } = landing
  return (
    <footer data-surface="inverse" className="bg-surface-deep pt-footer pb-26 text-text-inverse-muted md:pb-8">
      <div className="mx-auto max-w-page px-gutter">
        <div className="grid grid-fit-200 gap-10 border-b border-border-inverse-soft pb-12">
          <div className="flex flex-col gap-4">
            <Logo name={brand.name} monogram={brand.monogram} tone="dark" size="lg" />
            <p className="m-0 font-display text-spec font-medium italic leading-snug text-accent-inverse">{brand.motto}</p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={columnTitle}>
              {footer.explore}
            </h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {landing.nav.links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} variant="footer" className="inline-block">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnTitle}>{footer.contact}</h2>
            <ul className="m-0 flex list-none flex-col p-0">
              <li>
                <NavLink href={footer.phone.href} variant="footer" className="inline-block">
                  {footer.phone.label}
                </NavLink>
              </li>
              <li>
                <NavLink href={footer.email.href} variant="footer" className="inline-block">
                  {footer.email.label}
                </NavLink>
              </li>
              <li className="py-2 font-sans text-ui leading-relaxed">{footer.city}</li>
            </ul>
          </div>

          <div>
            <h2 className={columnTitle}>{footer.social}</h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {footer.socialLinks.map((link) => (
                <li key={link.label}>
                  <NavLink href={link.href} variant="footer" target="_blank" rel="noopener" className="inline-block">
                    {link.label}
                    <VisuallyHidden>{a11y.newWindow}</VisuallyHidden>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 pt-6 font-sans text-xs leading-relaxed">
          <p className="m-0">{footer.copyright}</p>
          <a href={footer.privacy.href} className="text-text-inverse-muted hover:text-text-inverse">
            {footer.privacy.label}
          </a>
        </div>
      </div>
    </footer>
  )
}
