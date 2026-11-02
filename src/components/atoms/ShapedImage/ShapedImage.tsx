import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const frameVariants = cva('relative overflow-hidden bg-surface-placeholder', {
  variants: {
    shape: {
      arch: 'rounded-arch',
      corner: 'rounded-corner',
      'corner-lg': 'rounded-corner-lg',
      'corner-bl': 'rounded-corner-bl',
      rounded: 'rounded-md',
      none: '',
    },
    aspect: {
      portrait: 'aspect-portrait',
      photo: 'aspect-photo',
      wide: 'aspect-wide',
      map: 'aspect-map',
      fill: 'h-full',
    },
  },
  defaultVariants: { shape: 'rounded', aspect: 'photo' },
})

type ShapedImageProps = Omit<ComponentProps<'img'>, 'alt' | 'width' | 'height'> &
  VariantProps<typeof frameVariants> & {
    /** Obligatorio. Descriptivo si la imagen informa; "" si es decorativa. */
    alt: string
    width: number
    height: number
    frameClassName?: string
  }

/**
 * <img> real (no background-image) dentro de un marco con la forma de marca.
 * width/height reservan el espacio y evitan saltos de layout.
 */
export function ShapedImage({
  alt,
  shape,
  aspect,
  frameClassName,
  className,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: ShapedImageProps) {
  return (
    <div className={cn(frameVariants({ shape, aspect }), frameClassName)}>
      <img
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={cn('absolute inset-0 size-full object-cover', className)}
        {...props}
      />
    </div>
  )
}
