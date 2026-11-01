import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex min-h-7 items-center rounded-full px-3.5 font-sans text-overline font-bold uppercase leading-none tracking-badge',
  {
    variants: {
      variant: {
        gold: 'bg-accent-inverse text-text',
        outline: 'border border-surface-inverse text-surface-inverse',
      },
    },
    defaultVariants: { variant: 'gold' },
  },
)

/** Estado en texto legible (nunca solo color). No es interactivo. */
export function Badge({ variant, className, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
