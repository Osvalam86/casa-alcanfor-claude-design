import { useRef, type KeyboardEvent, type MouseEventHandler } from 'react'
import { landing } from '@/content/landing'
import { cn } from '@/lib/cn'
import { photoProps } from '@/lib/unsplash'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { ShapedImage } from '@/components/atoms/ShapedImage'
import { SpaceSpec } from '@/components/atoms/SpaceSpec'

type SpacesShowcaseProps = {
  activeIndex: number
  onChange: (index: number) => void
  onVisit: MouseEventHandler<HTMLAnchorElement>
}

/**
 * Patrón tabs de APG (no hay nativo): tablist/tab/tabpanel, roving tabindex y teclado completo
 * (← → Inicio Fin). Activación automática: mover el foco selecciona la pestaña.
 */
export function SpacesShowcase({ activeIndex, onChange, onVisit }: SpacesShowcaseProps) {
  const { spaces, cta } = landing
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const space = spaces.items[activeIndex]
  const count = spaces.items.length

  const select = (index: number) => {
    onChange(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: (activeIndex + 1) % count,
      ArrowLeft: (activeIndex - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(keys[event.key])
  }

  return (
    <section id="espacios" tabIndex={-1} aria-labelledby="sp-h" className="py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-head flex max-w-170 flex-col gap-3">
          <Eyebrow data-reveal="">{spaces.eyebrow}</Eyebrow>
          <Heading as="h2" id="sp-h" data-reveal="">
            {spaces.title}
          </Heading>
        </div>

        <div
          role="tablist"
          aria-label={spaces.tablistLabel}
          className="mb-8 flex gap-2 overflow-x-auto border-b border-border"
        >
          {spaces.items.map((item, index) => {
            const selected = index === activeIndex
            return (
              <button
                key={item.name}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`space-tab-${index}`}
                aria-selected={selected}
                aria-controls="space-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(index)}
                onKeyDown={onKeyDown}
                className={cn(
                  'mr-6 flex min-h-14 flex-none cursor-pointer flex-col items-start gap-1 border-0 border-b-2 bg-transparent px-1 py-3 font-sans text-body font-semibold leading-tight transition-colors duration-base',
                  selected ? 'border-accent text-text' : 'border-transparent text-text-muted hover:text-text',
                )}
              >
                {item.name}{' '}
                <span className="font-sans text-xs font-normal leading-tight text-text-muted">{item.capacity}</span>
              </button>
            )
          })}
        </div>

        <div
          id="space-panel"
          role="tabpanel"
          aria-labelledby={`space-tab-${activeIndex}`}
          tabIndex={0}
          className="grid grid-fit-380 items-center gap-split"
        >
          <ShapedImage
            key={space.photo.id}
            {...photoProps(space.photo, '(min-width: 1024px) 640px, 100vw')}
            alt={space.photo.alt}
            shape="corner-lg"
            aspect="wide"
          />
          <div className="flex flex-col gap-6">
            <Heading as="h3" size="h3">
              {space.name}
            </Heading>
            <p className="m-0 max-w-measure-sm font-sans text-body-lg text-text-muted">{space.description}</p>
            <dl className="m-0 grid grid-cols-2 border-t border-border">
              {space.specs.map((spec) => (
                <SpaceSpec key={spec.term} term={spec.term} value={spec.value} />
              ))}
            </dl>
            <Button href={cta.contactHref} variant="secondary" onClick={onVisit} className="self-start px-6">
              {cta.visitGuided}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
