import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type DividerProps = Omit<ComponentProps<'div'>, 'children'> & {
  tone?: 'sage' | 'gold'
}

/** Ornamento línea · rombo · línea. Puramente decorativo. */
export function Divider({ tone = 'sage', className, ...props }: DividerProps) {
  const color = tone === 'sage' ? 'bg-border-decor' : 'bg-accent-inverse'
  const border = tone === 'sage' ? 'border-border-decor' : 'border-accent-inverse'
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-3', className)} {...props}>
      <span className={cn('h-px flex-1', color)} />
      <span className={cn('size-2 rotate-45 border', border)} />
      <span className={cn('h-px flex-1', color)} />
    </div>
  )
}
