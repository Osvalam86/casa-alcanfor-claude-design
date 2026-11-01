import type { QuoteValues } from '@/lib/validation'

/**
 * Envío simulado (CLAUDE.md §7.1, D12): no hay destino definido todavía.
 * Mantiene la firma async para conectar el servicio real sin tocar el formulario.
 */
export async function submitQuote(values: QuoteValues): Promise<{ ok: true }> {
  void values
  await new Promise((resolve) => setTimeout(resolve, 1400))
  return { ok: true }
}
