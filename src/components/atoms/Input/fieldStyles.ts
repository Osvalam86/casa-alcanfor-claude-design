import { cva, type VariantProps } from 'class-variance-authority'

/** Estilos compartidos por Input, Select, Textarea y NumberStepper. */
export const fieldVariants = cva(
  'w-full rounded-xs border font-sans text-text transition-colors duration-base disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-surface-alt disabled:text-disabled-text',
  {
    variants: {
      /** field = formulario de contacto (#FFFDF9, 16px) · quiet = verificador rápido del hero (#F7F2EA, 15px) */
      tone: {
        field: 'bg-surface-field text-body',
        quiet: 'bg-surface text-ui',
      },
      invalid: {
        true: 'border-error',
        false: 'border-border-ui',
      },
    },
    defaultVariants: { tone: 'field', invalid: false },
  },
)

export type FieldVariants = VariantProps<typeof fieldVariants>
