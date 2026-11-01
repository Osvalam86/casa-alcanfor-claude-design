import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const eyebrowVariants = cva('m-0 font-sans text-overline font-semibold uppercase', {
  variants: {
    tone: {
      accent: 'text-accent',
      muted: 'text-text-muted',
      inverse: 'text-accent-inverse',
      'inverse-muted': 'text-text-inverse-muted',
    },
  },
  defaultVariants: { tone: 'accent' },
})

/** Overline sobre un título. Es un <p>, no un encabezado: no crea una subsección. */
export function Eyebrow({ tone, className, ...props }: ComponentProps<'p'> & VariantProps<typeof eyebrowVariants>) {
  return <p className={cn(eyebrowVariants({ tone }), className)} {...props} />
}
