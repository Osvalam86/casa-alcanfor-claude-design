import { useId, useState, type ReactNode } from 'react'
import { designSystem as ds } from '@/content/designSystem'
import { photoProps } from '@/lib/unsplash'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Chip } from '@/components/atoms/Chip'
import { Divider } from '@/components/atoms/Divider'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon, type IconName } from '@/components/atoms/Icon'
import { IconButton } from '@/components/atoms/IconButton'
import { Input } from '@/components/atoms/Input'
import { Logo } from '@/components/atoms/Logo'
import { NavLink } from '@/components/atoms/NavLink'
import { Notice } from '@/components/atoms/Notice'
import { PriceTag } from '@/components/atoms/PriceTag'
import { RatingStars } from '@/components/atoms/RatingStars'
import { Select } from '@/components/atoms/Select'
import { ShapedImage } from '@/components/atoms/ShapedImage'
import { SkipLink } from '@/components/atoms/SkipLink'
import { SpaceSpec } from '@/components/atoms/SpaceSpec'
import { StatItem } from '@/components/atoms/StatItem'
import { TextLink } from '@/components/atoms/TextLink'
import { Textarea } from '@/components/atoms/Textarea'
import { AccordionItem } from '@/components/molecules/AccordionItem'
import { ContactItem } from '@/components/molecules/ContactItem'
import { ErrorSummary } from '@/components/molecules/ErrorSummary'
import { EventTypeCard } from '@/components/molecules/EventTypeCard'
import { FeatureItem } from '@/components/molecules/FeatureItem'
import { FormField } from '@/components/molecules/FormField'
import { GalleryItem } from '@/components/molecules/GalleryItem'
import { NumberStepper } from '@/components/molecules/NumberStepper'
import { PackageCard } from '@/components/molecules/PackageCard'
import { ProcessStep } from '@/components/molecules/ProcessStep'
import { TestimonialQuote } from '@/components/molecules/TestimonialQuote'

const ICONS: IconName[] = [
  'grid', 'user', 'tag', 'plus-circle', 'pin', 'clock', 'whatsapp', 'check', 'arrow-right', 'play', 'gallery',
  'menu', 'close', 'chevron-left', 'chevron-right', 'chevron-down', 'alert-circle', 'info-circle', 'plus', 'calendar',
]

/** Sección del sistema con nombre accesible tomado de su h2 (landmark region navegable). */
function DsSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  const headingId = `${id}-h`
  return (
    <section id={id} aria-labelledby={headingId} className="border-b border-border py-16">
      <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
      <Heading as="h2" id={headingId} size="h2" className="mb-10">
        {title}
      </Heading>
      {children}
    </section>
  )
}

/** Bloque de un componente: título h3 y su muestra. */
function Specimen({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Heading as="h3" size="h4">
        {title}
      </Heading>
      {children}
    </div>
  )
}

/** Etiqueta técnica de una muestra (nombre de variante o estado). */
function Caption({ children }: { children: ReactNode }) {
  return <span className="font-mono text-xs text-text-muted">{children}</span>
}

export function DesignSystemPage() {
  const stepperId = useId()
  const [guests, setGuests] = useState(120)
  const [chip, setChip] = useState<string>(ds.atoms.chips.items[0])
  const [openFaq, setOpenFaq] = useState<number | null>(1)

  return (
    <>
      <SkipLink href="#main">{ds.skipLink}</SkipLink>

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-gutter py-8">
          <Logo name={ds.brand.title} monogram={ds.brand.monogram} />
          <nav aria-label={ds.nav.label}>
            <ul className="m-0 flex list-none flex-wrap gap-5 p-0">
              {ds.nav.links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} className="text-sm">
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink href={ds.nav.landing.href} className="text-sm font-semibold text-accent">
                  {ds.nav.landing.label}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-page px-gutter pb-32">
        {/* ── Tokens ── */}
        <section id="tokens" aria-labelledby="tokens-h" className="border-b border-border py-16">
          <Eyebrow className="mb-2">{ds.tokens.eyebrow}</Eyebrow>
          <Heading as="h1" id="tokens-h" size="display-l" className="mb-10">
            {ds.tokens.title}
          </Heading>

          <Heading as="h2" size="display-sm" className="mb-5">
            {ds.tokens.color.title}
          </Heading>
          <ul className="m-0 mb-4 grid list-none grid-fill-150 gap-4 p-0">
            {ds.tokens.color.swatches.map((s) => (
              <li key={s.token} className="overflow-hidden rounded-md border border-border">
                <div aria-hidden="true" className={cn('h-22', s.className)} />
                <dl className="m-0 p-3 font-sans text-xs leading-relaxed">
                  <dt className="font-bold">{s.primitive}</dt>
                  <dd className="m-0">
                    {s.hex} · {s.use}
                  </dd>
                  <dd className="m-0 font-mono text-text-muted">--color-{s.token}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <ul className="m-0 mb-14 flex list-none flex-wrap gap-3 p-0">
            {ds.tokens.color.states.map((s) => (
              <li key={s.label} className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 font-sans text-xs font-medium">
                <span aria-hidden="true" className={cn('size-3.5 rounded-full', s.className)} />
                {s.label}
              </li>
            ))}
          </ul>

          <Heading as="h2" size="display-sm" className="mb-5">
            {ds.tokens.type.title}
          </Heading>
          <dl className="m-0 mb-14 border-t border-border">
            {ds.tokens.type.rows.map((row) => (
              <div key={row.spec} className="flex flex-col gap-2 border-b border-border py-4 md:flex-row md:items-baseline md:gap-6">
                <dt className="font-mono text-xs text-text-muted md:w-45 md:flex-none">{row.spec}</dt>
                <dd className={cn('m-0', row.className)}>{row.sample}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-fit-240 gap-10">
            <div>
              <Heading as="h2" size="display-sm" className="mb-5">
                {ds.tokens.spacing.title}
              </Heading>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {ds.tokens.spacing.steps.map((step) => (
                  <li key={step.px} className="flex items-center gap-3 font-mono text-xs">
                    <span className="w-9">{step.px}</span>
                    <span aria-hidden="true" className={cn('h-3 bg-border-decor', step.className)} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Heading as="h2" size="display-sm" className="mb-5">
                {ds.tokens.shape.title}
              </Heading>
              <ul className="m-0 flex list-none flex-wrap items-start gap-4 p-0">
                {ds.tokens.shape.radii.map((r) => (
                  <li key={r.label} className="flex flex-col gap-1.5 font-mono text-xs">
                    <span aria-hidden="true" className={r.className} />
                    {r.label}
                  </li>
                ))}
              </ul>
              <ul className="m-0 mt-6 flex list-none gap-4 p-0">
                {ds.tokens.shape.shadows.map((s) => (
                  <li key={s.label} className={cn('flex h-18 flex-1 items-center justify-center rounded-md bg-surface font-mono text-xs', s.className)}>
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Heading as="h2" size="display-sm" className="mb-5">
                {ds.tokens.motion.title}
              </Heading>
              <dl className="m-0 flex flex-col gap-2.5 font-sans text-sm leading-relaxed text-text-muted">
                {ds.tokens.motion.items.map((m) => (
                  <div key={m.value}>
                    <dt className="inline font-bold text-text">{m.value}</dt> · <dd className="m-0 inline">{m.use}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-text-muted">{ds.tokens.motion.note}</p>
            </div>
          </div>
        </section>

        {/* ── Átomos ── */}
        <DsSection id="atomos" eyebrow={ds.atoms.eyebrow} title={ds.atoms.title}>
          <p className="mb-10 max-w-measure-lg font-sans text-body text-text-muted">{ds.atoms.interactionNote}</p>

          <Specimen title={ds.atoms.button.title} className="mb-12">
            <div className="flex flex-wrap items-center gap-4">
              <Button>{ds.atoms.button.primary}</Button>
              <Button disabled>{ds.atoms.button.primary}</Button>
              <Button loading>{ds.atoms.button.loading}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary">{ds.atoms.button.secondary}</Button>
              <Button variant="secondary" disabled>
                {ds.atoms.button.secondary}
              </Button>
              <Button variant="ghost" icon={<Icon name="gallery" size={14} />}>
                {ds.atoms.button.ghost}
              </Button>
              <Button variant="outline-sage" icon={<Icon name="whatsapp" size={20} />}>
                {ds.atoms.button.sage}
              </Button>
              <TextLink href="#atomos">{ds.atoms.button.link}</TextLink>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">{ds.atoms.button.sizes.sm}</Button>
              <Button size="md">{ds.atoms.button.sizes.md}</Button>
              <Button size="lg">{ds.atoms.button.sizes.lg}</Button>
              <Button size="xl">{ds.atoms.button.sizes.xl}</Button>
              <IconButton icon="menu" label={ds.atoms.button.iconButton} />
            </div>
            <div data-surface="inverse" className="flex flex-wrap items-center gap-4 rounded-md bg-surface-inverse p-6">
              <Button variant="inverse">{ds.atoms.button.inverse}</Button>
              <IconButton icon="close" variant="overlay" size="lg" label={ds.atoms.button.iconButtonOverlay} />
              <Caption>
                <span className="text-text-inverse-muted">data-surface="inverse"</span>
              </Caption>
            </div>
          </Specimen>

          <Specimen title={ds.atoms.fields.title} className="mb-12">
            <div className="grid grid-fit-240 gap-6">
              <FormField label={ds.atoms.fields.name.label}>
                {(field) => <Input {...field} defaultValue={ds.atoms.fields.name.value} autoComplete="name" />}
              </FormField>
              <FormField label={ds.atoms.fields.helper.label} helper={ds.atoms.fields.helper.helper}>
                {(field) => <Input {...field} type="tel" inputMode="tel" autoComplete="tel-national" />}
              </FormField>
              <FormField label={ds.atoms.fields.error.label} error={ds.atoms.fields.error.error}>
                {(field) => <Input {...field} type="tel" defaultValue={ds.atoms.fields.error.value} />}
              </FormField>
              <FormField label={ds.atoms.fields.disabled.label}>
                {(field) => <Input {...field} disabled defaultValue={ds.atoms.fields.disabled.value} />}
              </FormField>
              <FormField label={ds.atoms.fields.select.label}>
                {(field) => (
                  <Select {...field} defaultValue="">
                    <option value="">{ds.atoms.fields.select.placeholder}</option>
                    {ds.atoms.fields.select.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label={ds.atoms.fields.date.label}>{(field) => <Input {...field} type="date" />}</FormField>
              <FormField label={ds.atoms.fields.stepper.label} id={stepperId}>
                {(field) => (
                  <NumberStepper
                    {...field}
                    tone="field"
                    min={10}
                    max={450}
                    step={10}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    decrementLabel={ds.atoms.fields.stepper.decrement}
                    incrementLabel={ds.atoms.fields.stepper.increment}
                    onDecrement={() => setGuests((g) => Math.max(10, g - 10))}
                    onIncrement={() => setGuests((g) => Math.min(450, g + 10))}
                  />
                )}
              </FormField>
              <FormField label={ds.atoms.fields.textarea.label} optionalText={ds.atoms.fields.textarea.optional}>
                {(field) => <Textarea {...field} defaultValue={ds.atoms.fields.textarea.value} />}
              </FormField>
            </div>
            <div className="max-w-140 rounded-md bg-surface-alt p-5">
              <FormField label={ds.atoms.fields.select.label} labelSize="sm">
                {(field) => (
                  <Select {...field} tone="quiet" defaultValue="">
                    <option value="">{ds.atoms.fields.select.placeholder}</option>
                    {ds.atoms.fields.select.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </Select>
                )}
              </FormField>
              <Caption>tone="quiet" · verificador del hero</Caption>
            </div>
          </Specimen>

          <div className="grid grid-fit-240 gap-10">
            <Specimen title={ds.atoms.chips.title}>
              <div role="group" aria-label={ds.atoms.chips.title} className="flex flex-wrap gap-2">
                {ds.atoms.chips.items.map((item) => (
                  <Chip key={item} pressed={chip === item} onClick={() => setChip(item)}>
                    {item}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <Badge>{ds.atoms.chips.badges[0]}</Badge>
                <Badge variant="outline">{ds.atoms.chips.badges[1]}</Badge>
              </div>
            </Specimen>
            <Specimen title={ds.atoms.icons.title}>
              <ul className="m-0 flex list-none flex-wrap gap-4 p-0 text-text">
                {ICONS.map((name) => (
                  <li key={name} className="flex flex-col items-center gap-1">
                    <Icon name={name} size={28} />
                    <Caption>{name}</Caption>
                  </li>
                ))}
              </ul>
            </Specimen>
            <Specimen title={ds.atoms.misc.title}>
              <Divider className="w-55" />
              <div className="flex items-center gap-4">
                <Avatar variant="dark" size="lg">
                  {ds.atoms.misc.avatar}
                </Avatar>
                <RatingStars label={ds.atoms.misc.ratingLabel} className="text-body-lg" />
                <span className="font-sans text-sm font-medium">{ds.atoms.misc.rating}</span>
              </div>
              <Logo name={ds.brand.name} monogram={ds.brand.monogram} tagline={ds.brand.tagline} />
              <div data-surface="inverse" className="rounded-md bg-surface-deep p-4">
                <Logo name={ds.brand.name} monogram={ds.brand.monogram} tone="dark" size="lg" />
              </div>
            </Specimen>
          </div>

          <Specimen title={ds.atoms.notices.title} className="mt-12">
            <div className="flex max-w-140 flex-col gap-3">
              <Notice>{ds.atoms.notices.info}</Notice>
              <Notice variant="success">{ds.atoms.notices.success}</Notice>
              <Notice variant="error">{ds.atoms.notices.error}</Notice>
            </div>
          </Specimen>

          <Specimen title={ds.atoms.image.title} className="mt-12">
            <ul className="m-0 grid list-none grid-fill-150 gap-4 p-0">
              {ds.atoms.image.shapes.map((shape) => (
                <li key={shape} className="flex flex-col gap-2">
                  <ShapedImage {...photoProps(ds.atoms.image.photo, '200px', 480)} shape={shape} aspect="portrait" />
                  <Caption>{shape}</Caption>
                </li>
              ))}
            </ul>
          </Specimen>
        </DsSection>

        {/* ── Moléculas ── */}
        <DsSection id="moleculas" eyebrow={ds.molecules.eyebrow} title={ds.molecules.title}>
          <div className="grid grid-fit-300 gap-8">
            <Specimen title={ds.molecules.stat.title}>
              <ul className="m-0 list-none p-0">
                <StatItem value={ds.molecules.stat.value} label={ds.molecules.stat.label} />
              </ul>
              <StatItem as="div" variant="card" value={ds.molecules.stat.cardValue} label={ds.molecules.stat.cardLabel} className="self-start" />
            </Specimen>
            <Specimen title={ds.molecules.price.title}>
              <PriceTag prefix={ds.molecules.price.prefix} amount={ds.molecules.price.amount} suffix={ds.molecules.price.suffix} />
            </Specimen>
            <Specimen title={ds.molecules.spec.title}>
              <dl className="m-0 border-t border-border">
                <SpaceSpec term={ds.molecules.spec.term} value={ds.molecules.spec.value} />
              </dl>
            </Specimen>
            <Specimen title={ds.molecules.feature.title}>
              <ul data-surface="inverse" className="m-0 list-none rounded-md bg-surface-inverse p-6">
                <FeatureItem icon="tag" title={ds.molecules.feature.heading} description={ds.molecules.feature.description} headingLevel="h4" />
              </ul>
            </Specimen>
            <Specimen title={ds.molecules.step.title}>
              <ol className="m-0 list-none p-0">
                <ProcessStep
                  number={ds.molecules.step.number}
                  srPrefix={ds.molecules.step.srPrefix}
                  title={ds.molecules.step.heading}
                  description={ds.molecules.step.description}
                />
              </ol>
            </Specimen>
            <Specimen title={ds.molecules.eventCard.title}>
              <ul className="m-0 list-none p-0">
                <EventTypeCard
                  photo={ds.molecules.eventCard.photo}
                  title={ds.molecules.eventCard.heading}
                  description={ds.molecules.eventCard.description}
                  linkLabel={ds.molecules.eventCard.link}
                  href="#moleculas"
                />
              </ul>
            </Specimen>
            <Specimen title={ds.molecules.testimonial.title}>
              <TestimonialQuote
                quote={ds.molecules.testimonial.quote}
                author={ds.molecules.testimonial.author}
                initials={ds.molecules.testimonial.initials}
                meta={ds.molecules.testimonial.meta}
                ratingLabel={ds.molecules.testimonial.ratingLabel}
              />
            </Specimen>
            <Specimen title={ds.molecules.contact.title}>
              <dl className="m-0">
                <ContactItem icon="clock" term={ds.molecules.contact.term}>
                  {ds.molecules.contact.value}
                </ContactItem>
              </dl>
            </Specimen>
            <Specimen title={ds.molecules.gallery.title}>
              <div className="h-60 w-48">
                <GalleryItem photo={ds.molecules.gallery.photo} label={ds.molecules.gallery.label} onOpen={() => undefined} shape="arch" />
              </div>
            </Specimen>
          </div>

          <Specimen title={ds.molecules.packageCard.title} className="mt-12">
            <ul className="m-0 grid list-none grid-fit-300 items-stretch gap-6 p-0">
              <PackageCard
                name={ds.molecules.packageCard.default.name}
                pricePrefix={ds.molecules.packageCard.prefix}
                price={ds.molecules.packageCard.default.price}
                priceSuffix={ds.molecules.packageCard.suffix}
                features={ds.molecules.packageCard.default.features}
                ctaLabel={ds.molecules.packageCard.cta}
              />
              <PackageCard
                highlighted
                badge={ds.molecules.packageCard.highlighted.badge}
                name={ds.molecules.packageCard.highlighted.name}
                pricePrefix={ds.molecules.packageCard.prefix}
                price={ds.molecules.packageCard.highlighted.price}
                priceSuffix={ds.molecules.packageCard.suffix}
                features={ds.molecules.packageCard.highlighted.features}
                ctaLabel={ds.molecules.packageCard.cta}
              />
            </ul>
          </Specimen>

          <div className="mt-12 grid grid-fit-340 gap-10">
            <Specimen title={ds.molecules.accordion.title}>
              <div className="border-t border-border">
                {ds.molecules.accordion.items.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    headingLevel="h4"
                    expanded={openFaq === i}
                    onToggle={() => setOpenFaq((current) => (current === i ? null : i))}
                  >
                    <p className="m-0">{item.a}</p>
                  </AccordionItem>
                ))}
              </div>
            </Specimen>
            <Specimen title={ds.molecules.formField.title}>
              <ErrorSummary title={ds.molecules.errorSummary.title} items={ds.molecules.errorSummary.items} />
              <FormField id="ds-err-name" label={ds.molecules.errorSummary.fields.name} error={ds.molecules.errorSummary.items[0].message}>
                {(field) => <Input {...field} autoComplete="off" />}
              </FormField>
              <FormField id="ds-err-wa" label={ds.molecules.errorSummary.fields.wa} error={ds.molecules.errorSummary.items[1].message}>
                {(field) => <Input {...field} type="tel" autoComplete="off" />}
              </FormField>
            </Specimen>
          </div>
        </DsSection>
      </main>
    </>
  )
}
