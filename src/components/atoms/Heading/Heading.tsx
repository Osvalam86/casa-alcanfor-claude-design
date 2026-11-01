import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const headingVariants = cva('m-0 text-balance', {
  variants: {
    size: {
      'display-xl': 'font-display text-display-xl font-medium',
      'display-l': 'font-display text-display-l font-medium',
      h2: 'font-display text-h2 font-medium',
      h3: 'font-display text-h3 font-medium',
      'h3-card': 'font-display text-h3-card font-medium',
      'display-sm': 'font-display text-display-sm font-medium',
      'title-lg': 'font-display text-title-lg font-medium',
      title: 'font-display text-title font-medium',
      h4: 'font-sans text-h4 font-semibold',
      feature: 'font-sans text-body-lg font-semibold leading-snug',
    },
    tone: {
      default: 'text-text',
      inverse: 'text-text-inverse',
    },
  },
  defaultVariants: { size: 'h2', tone: 'default' },
})

type Level = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type HeadingProps = ComponentProps<'h2'> &
  VariantProps<typeof headingVariants> & {
    /** Nivel real en el documento. Lo decide la jerarquía, no el tamaño visual (size). */
    as: Level
  }

export function Heading({ as: Tag, size, tone, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size, tone }), className)} {...props} />
}
