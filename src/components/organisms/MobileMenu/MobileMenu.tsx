import type { MouseEvent } from 'react'
import { landing } from '@/content/landing'
import { useModalDialog } from '@/lib/hooks/useModalDialog'
import { NavLink } from '@/components/atoms/NavLink'
import { Button } from '@/components/atoms/Button'
import { IconButton } from '@/components/atoms/IconButton'

type MobileMenuProps = {
  id: string
  open: boolean
  onClose: () => void
  /** Cierra el menú y lleva foco y scroll a la sección (sin devolver el foco al botón del menú). */
  onNavigate: (href: string) => void
  onVisit: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * <dialog> modal nativo: foco atrapado, fondo inerte y Escape resueltos por showModal().
 * Nombre accesible con aria-label ("Menú"); el nombre de marca visible es solo decorativo aquí.
 */
export function MobileMenu({ id, open, onClose, onNavigate, onVisit }: MobileMenuProps) {
  const { ref, onCancel, onBackdropClick } = useModalDialog(open, onClose)
  const { nav, brand, cta } = landing

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={nav.menuTitle}
      onCancel={onCancel}
      onClick={onBackdropClick}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-100 bg-surface p-0 text-text shadow-2 backdrop:bg-overlay"
    >
      <div className="flex h-full flex-col gap-8 px-6 pt-5 pb-8">
        <div className="flex items-center justify-between">
          <span aria-hidden="true" className="font-display text-spec font-semibold leading-none">
            {brand.name}
          </span>
          <IconButton icon="close" label={nav.closeMenu} onClick={onClose} />
        </div>

        <nav aria-label={nav.menuNavLabel}>
          <ul className="m-0 flex list-none flex-col p-0">
            {nav.links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} variant="menu" onClick={(event) => go(event, link.href)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button href={cta.contactHref} fullWidth onClick={(event) => go(event, cta.contactHref)}>
            {cta.availability}
          </Button>
          <Button href={cta.contactHref} variant="secondary" fullWidth onClick={onVisit}>
            {cta.visit}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
