import type { MouseEventHandler } from 'react'
import { landing } from '@/content/landing'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { ProcessStep } from '@/components/molecules/ProcessStep'

type ProcessTimelineProps = {
  onVisit: MouseEventHandler<HTMLAnchorElement>
}

/** Los pasos son un <ol>: aquí el orden sí cambia el significado. */
export function ProcessTimeline({ onVisit }: ProcessTimelineProps) {
  const { process, cta } = landing
  return (
    <section aria-labelledby="pr-h" className="py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-head flex max-w-160 flex-col gap-3">
          <Eyebrow data-reveal="">{process.eyebrow}</Eyebrow>
          <Heading as="h2" id="pr-h" data-reveal="">
            {process.title}
          </Heading>
        </div>
        <ol className="m-0 grid list-none grid-fit-230 gap-x-8 gap-y-10 p-0">
          {process.steps.map((step) => (
            <ProcessStep key={step.number} number={step.number} srPrefix={step.srPrefix} title={step.title} description={step.description} />
          ))}
        </ol>
        <div data-reveal="" className="mt-head flex flex-wrap gap-3">
          <Button href={cta.contactHref}>{cta.availability}</Button>
          <Button href={cta.contactHref} variant="secondary" onClick={onVisit} className="px-6">
            {cta.visit}
          </Button>
        </div>
      </div>
    </section>
  )
}
