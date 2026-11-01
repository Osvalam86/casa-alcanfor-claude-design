import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge debe conocer los tokens propios para no confundir, p. ej., text-h2 (tamaño) con text-accent (color).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display-xl', 'display-l', 'h2', 'h3', 'h3-card', 'h4', 'quote', 'step', 'price-xl', 'price',
        'stat-lg', 'stat', 'display-sm', 'title-lg', 'quote-sm', 'title', 'spec', 'body-lg', 'body',
        'ui', 'sm', 'xs', 'overline', 'micro',
      ],
      radius: ['xs', 'md', 'full'],
      shadow: ['1', '2', 'up'],
    },
    classGroups: {
      rounded: ['rounded-arch', 'rounded-arch-sm', 'rounded-arch-top', 'rounded-corner', 'rounded-corner-lg', 'rounded-corner-bl'],
      duration: ['duration-fast', 'duration-base', 'duration-slow', 'duration-slower'],
      'border-w': ['border-stroke'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
