import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldVariants, type FieldVariants } from '@/components/atoms/Input'

type TextareaProps = Omit<ComponentProps<'textarea'>, 'aria-invalid'> &
  Omit<FieldVariants, 'invalid'> & {
    invalid?: boolean
  }

export function Textarea({ tone, invalid = false, rows = 4, className, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldVariants({ tone, invalid }), 'resize-y px-3.5 py-3 leading-loose', className)}
      {...props}
    />
  )
}
