import { cn } from '@/lib/cn'
import { Heading } from '@/components/atoms/Heading'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

type ProcessStepProps = {
  /** Número visible ("01"); decorativo porque el <ol> ya da la posición. */
  number: string
  /** Prefijo para lector de pantalla dentro del título ("Paso 1: "). */
  srPrefix: string
  title: string
  description: string
  className?: string
}

/** Paso de un proceso: se usa dentro de un <ol>, donde el orden sí importa. */
export function ProcessStep({ number, srPrefix, title, description, className }: ProcessStepProps) {
  return (
    <li className={cn('flex flex-col gap-3 border-t border-border-decor pt-6', className)}>
      <span aria-hidden="true" className="font-display text-step font-medium text-accent">
        {number}
      </span>
      <Heading as="h3" size="title">
        <VisuallyHidden>{srPrefix}</VisuallyHidden>
        {title}
      </Heading>
      <p className="m-0 font-sans text-body text-text-muted">{description}</p>
    </li>
  )
}
