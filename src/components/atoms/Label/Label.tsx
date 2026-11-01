import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const labelVariants = cva('font-sans font-semibold text-text', {
  variants: {
    size: {
      md: 'text-sm',
      sm: 'text-xs leading-snug',
    },
  },
  defaultVariants: { size: 'md' },
})

type LabelProps = ComponentProps<'label'> &
  VariantProps<typeof labelVariants> & {
    htmlFor: string
    /** "(opcional)": va dentro del <label> para que forme parte del nombre accesible. */
    optionalText?: string
  }

export function Label({ size, optionalText, className, children, ...props }: LabelProps) {
  return (
    <label className={cn(labelVariants({ size }), className)} {...props}>
      {children}
      {optionalText && <span className="font-normal text-text-muted"> {optionalText}</span>}
    </label>
  )
}
