import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/atoms/Icon'

type AccordionItemProps = {
  question: string
  children: ReactNode
  expanded: boolean
  onToggle: () => void
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/**
 * Patrón disclosure de APG: <hN> > <button aria-expanded aria-controls> + panel con id.
 * Sin role="region" en el panel: con más de 6 paneles APG lo desaconseja (satura los landmarks).
 * El panel usa `hidden` cuando está cerrado, así queda fuera del árbol de accesibilidad.
 */
export function AccordionItem({ question, children, expanded, onToggle, headingLevel: Tag = 'h3', className }: AccordionItemProps) {
  const id = useId()
  const buttonId = `${id}-btn`
  const panelId = `${id}-panel`

  return (
    <div className={cn('border-b border-border', className)}>
      <Tag className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-5 text-left font-sans text-body-lg font-semibold leading-normal text-text transition-colors duration-base hover:text-accent"
        >
          {question}
          <span
            aria-hidden="true"
            className={cn(
              'flex size-8 flex-none items-center justify-center rounded-full border border-border-ui transition-transform duration-base ease-out-expo',
              expanded && 'rotate-45',
            )}
          >
            <Icon name="plus" size={14} />
          </span>
        </button>
      </Tag>
      <div id={panelId} hidden={!expanded} className="pr-14 pb-6">
        <div className="m-0 max-w-measure-lg font-sans text-body text-text-muted">{children}</div>
      </div>
    </div>
  )
}
