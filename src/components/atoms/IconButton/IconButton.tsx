import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from '@/components/atoms/Icon'

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-base cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        light: 'border border-border-ui bg-transparent text-text hover:bg-surface-alt hover:text-text',
        overlay: 'border border-border-overlay bg-transparent text-text-inverse hover:bg-overlay hover:text-text-inverse',
        solid: 'bg-surface-inverse text-text-inverse shadow-2 hover:text-text-inverse transition ease-out-expo hover:-translate-y-0.5',
      },
      size: {
        md: 'size-11',
        lg: 'size-12',
        xl: 'size-15',
      },
    },
    defaultVariants: { variant: 'light', size: 'md' },
  },
)

type CommonProps = VariantProps<typeof iconButtonVariants> & {
  icon: IconName
  /** Nombre accesible: verbo + objeto ("Abrir menú", "Cerrar galería"). */
  label: string
  iconSize?: number
}

type AsButton = CommonProps & Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & { href?: undefined }
type AsLink = CommonProps & Omit<ComponentProps<'a'>, 'children' | 'aria-label'> & { href: string }
export type IconButtonProps = AsButton | AsLink

export function IconButton({ variant, size, icon, label, iconSize = 20, className, ...rest }: IconButtonProps) {
  const classes = cn(iconButtonVariants({ variant, size }), className)
  const glyph = <Icon name={icon} size={iconSize} />

  if (rest.href !== undefined) {
    return (
      <a {...(rest as ComponentProps<'a'>)} aria-label={label} className={classes}>
        {glyph}
      </a>
    )
  }
  const { type, ...buttonRest } = rest as ComponentProps<'button'>
  return (
    <button {...buttonRest} type={type ?? 'button'} aria-label={label} className={classes}>
      {glyph}
    </button>
  )
}
