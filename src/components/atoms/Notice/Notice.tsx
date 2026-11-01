import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from '@/components/atoms/Icon'

const noticeVariants = cva('m-0 flex gap-2.5 rounded-xs px-4 py-3 font-sans text-sm font-medium leading-relaxed', {
  variants: {
    variant: {
      info: 'bg-info-surface text-info-text',
      success: 'bg-info-surface text-success',
      error: 'border border-error bg-error-surface text-error',
    },
  },
  defaultVariants: { variant: 'info' },
})

const icons: Record<NonNullable<VariantProps<typeof noticeVariants>['variant']>, IconName> = {
  info: 'info-circle',
  success: 'check',
  error: 'alert-circle',
}

/**
 * Aviso en línea. Es presentacional: si debe anunciarse, el consumidor lo coloca dentro
 * de una región viva (role="status") que ya exista en el DOM antes del mensaje.
 */
export function Notice({ variant, className, children, ...props }: ComponentProps<'p'> & VariantProps<typeof noticeVariants>) {
  return (
    <p className={cn(noticeVariants({ variant }), className)} {...props}>
      <Icon name={icons[variant ?? 'info']} size={18} className="mt-px flex-none" />
      <span>{children}</span>
    </p>
  )
}
