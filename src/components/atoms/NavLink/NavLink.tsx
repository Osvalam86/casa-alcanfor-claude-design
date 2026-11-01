import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const navLinkVariants = cva('no-underline transition-colors duration-base', {
  variants: {
    variant: {
      header: 'inline-block py-3 font-sans text-ui font-medium text-text hover:text-accent',
      menu: 'block border-b border-border py-3.5 font-display text-display-sm font-medium text-text hover:text-accent',
      footer: 'py-2 font-sans text-ui font-normal text-text-inverse-muted hover:text-text-inverse',
    },
  },
  defaultVariants: { variant: 'header' },
})

type NavLinkProps = ComponentProps<'a'> & VariantProps<typeof navLinkVariants> & { href: string }

/** Enlace de navegación. Si apunta a la vista actual, el consumidor pasa aria-current="page". */
export function NavLink({ variant, className, ...props }: NavLinkProps) {
  return <a className={cn(navLinkVariants({ variant }), className)} {...props} />
}
