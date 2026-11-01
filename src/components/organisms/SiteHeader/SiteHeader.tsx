import type { MouseEventHandler } from 'react'
import { landing } from '@/content/landing'
import { cn } from '@/lib/cn'
import { useScrolled } from '@/lib/hooks/useScrolled'
import { Logo } from '@/components/atoms/Logo'
import { NavLink } from '@/components/atoms/NavLink'
import { Button } from '@/components/atoms/Button'
import { IconButton } from '@/components/atoms/IconButton'

type SiteHeaderProps = {
  menuId: string
  menuOpen: boolean
  onOpenMenu: () => void
  onVisit: MouseEventHandler<HTMLAnchorElement>
}

/**
 * <header> hijo de <body> → landmark banner. Nav principal visible desde lg; debajo, un botón
 * con aria-expanded/aria-controls abre el diálogo del menú móvil.
 */
export function SiteHeader({ menuId, menuOpen, onOpenMenu, onVisit }: SiteHeaderProps) {
  const scrolled = useScrolled()
  const { brand, nav } = landing

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-slow ease-out-expo',
        scrolled ? 'bg-scrim-header py-2 shadow-1' : 'bg-transparent py-5',
      )}
    >
      <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-gutter">
        <a href="#top" aria-label={brand.homeLabel} className="flex min-h-11 items-center text-text no-underline hover:text-text">
          <Logo name={brand.name} monogram={brand.monogram} tagline={brand.tagline} />
        </a>

        <nav aria-label={nav.label} className="hidden items-center gap-8 lg:flex">
          <ul className="m-0 flex list-none gap-7 p-0">
            {nav.links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
          <Button href={landing.cta.contactHref} onClick={onVisit} variant="secondary" size="md">
            {nav.visit}
          </Button>
        </nav>

        <IconButton
          icon="menu"
          iconSize={22}
          label={nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-haspopup="dialog"
          onClick={onOpenMenu}
          className="lg:hidden"
        />
      </div>
    </header>
  )
}
