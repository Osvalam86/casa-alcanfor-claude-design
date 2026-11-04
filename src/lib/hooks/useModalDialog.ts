import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type RefObject, type SyntheticEvent } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Conecta un <dialog> nativo con estado de React. showModal() aporta foco inicial, fondo inerte y
 * cierre con Escape (evento cancel), pero Chrome deja que Tab salga del diálogo hacia la interfaz del
 * navegador; onKeyDown cierra ese ciclo (CLAUDE.md §6: focus trap). Al cerrar, el foco vuelve
 * explícitamente al control que lo abrió.
 *
 * `initialFocus`: control que recibe el foco al abrir. Sin él decide Chrome, que en el menú móvil lo
 * dejaba en "Consulta disponibilidad", al final del diálogo.
 */
export function useModalDialog(open: boolean, onClose: () => void, initialFocus?: RefObject<HTMLElement | null>) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      initialFocus?.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      opener.current?.focus()
    }
  }, [open, initialFocus])

  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  /** Clic en el backdrop: el target es el propio <dialog>, no su contenido. */
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  /** Tab en el último enfocable vuelve al primero, y Shift+Tab en el primero va al último. */
  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.checkVisibility())
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === event.currentTarget)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return { ref, onCancel, onBackdropClick, onKeyDown }
}
