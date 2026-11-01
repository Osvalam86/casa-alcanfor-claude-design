import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Spinner } from '@/components/atoms/Spinner'

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2.5 rounded-xs font-sans font-semibold no-underline transition-colors duration-base cursor-pointer aria-disabled:cursor-not-allowed disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-action text-text-inverse hover:bg-action-hover hover:text-text-inverse active:bg-action-active disabled:bg-disabled-surface disabled:text-text-muted',
        secondary:
          'border border-accent text-accent hover:bg-accent hover:text-text-inverse active:border-accent-strong active:bg-accent-strong active:text-text-inverse disabled:border-disabled-border disabled:bg-transparent disabled:text-disabled-text',
        inverse:
          'bg-surface text-text hover:bg-surface-alt hover:text-text active:bg-border disabled:bg-disabled-surface disabled:text-text-muted',
        ghost: 'bg-transparent text-text hover:text-accent active:text-accent-strong disabled:text-disabled-text',
        'outline-sage':
          'border border-surface-inverse text-surface-inverse hover:bg-surface-inverse hover:text-text-inverse active:bg-surface-deep',
      },
      size: {
        sm: 'min-h-9 px-4 text-xs leading-none',
        md: 'min-h-11 px-5 text-sm leading-none',
        lg: 'min-h-13 px-7 text-ui leading-none',
        xl: 'min-h-14 px-8 text-body leading-none',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [{ variant: 'ghost', class: 'px-5.5' }],
    defaultVariants: { variant: 'primary', size: 'lg' },
  },
)

type Variants = VariantProps<typeof buttonVariants>

type CommonProps = Variants & {
  /** Ícono decorativo; en la variante ghost se dibuja dentro del círculo dorado. */
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  /** Bloquea la acción sin sacar el control del orden de foco (aria-disabled). */
  loading?: boolean
}

type ButtonAsButton = CommonProps & ComponentProps<'button'> & { href?: undefined }
type ButtonAsLink = CommonProps & ComponentProps<'a'> & { href: string }
export type ButtonProps = ButtonAsButton | ButtonAsLink

function Content({ icon, iconPosition = 'start', loading, variant, children }: CommonProps & { children?: ReactNode }) {
  const iconNode =
    icon && variant === 'ghost' ? (
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-full border border-accent text-accent"
      >
        {icon}
      </span>
    ) : (
      icon
    )
  return (
    <>
      {loading && <Spinner />}
      {iconPosition === 'start' && iconNode}
      {children}
      {iconPosition === 'end' && iconNode}
    </>
  )
}

export function Button({ variant, size, fullWidth, icon, iconPosition, loading, className, children, ...rest }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), loading && 'opacity-75', className)
  const content = (
    <Content icon={icon} iconPosition={iconPosition} loading={loading} variant={variant}>
      {children}
    </Content>
  )

  if (rest.href !== undefined) {
    return (
      <a {...(rest as ComponentProps<'a'>)} className={classes}>
        {content}
      </a>
    )
  }

  const { onClick, type, ...buttonRest } = rest as ComponentProps<'button'>
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }
  return (
    <button
      {...buttonRest}
      type={type ?? 'button'}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={classes}
    >
      {content}
    </button>
  )
}
