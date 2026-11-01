import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react'

/**
 * Conecta un <dialog> nativo con estado de React. showModal() aporta lo que pide CLAUDE.md §6:
 * foco dentro del diálogo, fondo inerte y cierre con Escape (evento cancel). Al cerrar, el foco
 * vuelve explícitamente al control que lo abrió.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
      opener.current?.focus()
    }
  }, [open])

  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  /** Clic en el backdrop: el target es el propio <dialog>, no su contenido. */
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return { ref, onCancel, onBackdropClick }
}
