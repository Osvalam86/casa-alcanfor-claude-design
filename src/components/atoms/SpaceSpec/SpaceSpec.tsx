import { cn } from '@/lib/cn'

type SpaceSpecProps = {
  term: string
  value: string
  className?: string
}

/** Un par término → valor. Se usa dentro de un <dl>; el <div> agrupa el par (permitido por HTML). */
export function SpaceSpec({ term, value, className }: SpaceSpecProps) {
  return (
    <div className={cn('flex flex-col gap-1 border-b border-border py-4 pr-3', className)}>
      <dt className="font-sans text-overline font-semibold uppercase text-text-muted">{term}</dt>
      <dd className="m-0 font-display text-spec font-medium text-text">{value}</dd>
    </div>
  )
}
