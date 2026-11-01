import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/atoms/Icon'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

const textLinkVariants = cva('group font-sans font-semibold no-underline', {
  variants: {
    variant: {
      /** "Ver ideas para bodas →": subrayado que crece al hover/foco */
      arrow: 'inline-flex min-h-11 items-center gap-2 self-start text-ui text-accent hover:text-accent',
      /** Enlace en línea dentro de un párrafo */
      inline: 'text-accent underline underline-offset-3 hover:text-text',
      /** Enlace compacto ("Cómo llegar") */
      plain: 'inline-flex min-h-6 items-center text-sm text-accent hover:text-text',
    },
  },
  defaultVariants: { variant: 'arrow' },
})

type TextLinkProps = ComponentProps<'a'> &
  VariantProps<typeof textLinkVariants> & {
    href: string
    /** Complemento solo para lector de pantalla, p. ej. " (se abre en una ventana nueva)". */
    srSuffix?: string
  }

export function TextLink({ variant, srSuffix, className, children, ...props }: TextLinkProps) {
  const suffix = srSuffix && <VisuallyHidden>{srSuffix}</VisuallyHidden>

  if (variant === 'arrow' || variant === undefined) {
    return (
      <a className={cn(textLinkVariants({ variant }), className)} {...props}>
        <span className="underline-grow pb-1 group-hover:underline-shown group-focus-visible:underline-shown">
          {children}
        </span>
        {suffix}
        <Icon name="arrow-right" size={16} />
      </a>
    )
  }

  return (
    <a className={cn(textLinkVariants({ variant }), className)} {...props}>
      {children}
      {suffix}
    </a>
  )
}
