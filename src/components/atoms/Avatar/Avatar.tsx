import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva(
  'flex flex-none items-center justify-center rounded-full font-display font-semibold leading-none',
  {
    variants: {
      variant: {
        dark: 'bg-surface-inverse text-text-inverse',
        light: 'border border-border bg-surface-alt text-text',
      },
      size: {
        md: 'size-11 text-ui',
        lg: 'size-12 text-body',
      },
    },
    defaultVariants: { variant: 'light', size: 'md' },
  },
)

/** Iniciales decorativas: el nombre completo siempre está como texto junto al avatar. */
export function Avatar({ variant, size, className, ...props }: ComponentProps<'span'> & VariantProps<typeof avatarVariants>) {
  return <span aria-hidden="true" className={cn(avatarVariants({ variant, size }), className)} {...props} />
}
