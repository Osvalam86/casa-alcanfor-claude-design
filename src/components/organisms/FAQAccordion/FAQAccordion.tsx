import { useState } from 'react'
import { landing } from '@/content/landing'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { AccordionItem } from '@/components/molecules/AccordionItem'

/** Preguntas con h3 > button (APG disclosure). La primera abre por defecto, como en el diseño. */
export function FAQAccordion() {
  const { faq, cta } = landing
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]))

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <section id="preguntas" aria-labelledby="fq-h" className="py-section">
      <div className="mx-auto grid max-w-page grid-fit-340 items-start gap-split px-gutter">
        <div className="flex flex-col gap-5 md:sticky md:top-30">
          <Eyebrow data-reveal="">{faq.eyebrow}</Eyebrow>
          <Heading as="h2" id="fq-h" data-reveal="">
            {faq.title}
          </Heading>
          <p data-reveal="" className="m-0 max-w-measure-xs font-sans text-body text-text-muted">
            {faq.lead}
          </p>
          <div data-reveal="" className="flex flex-wrap gap-3">
            <Button href={cta.contactHref}>{cta.availability}</Button>
          </div>
        </div>
        <div className="border-t border-border">
          {faq.items.map((item, index) => (
            <AccordionItem key={item.q} question={item.q} expanded={open.has(index)} onToggle={() => toggle(index)}>
              <p className="m-0">{item.a}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  )
}
