/**
 * Anchos del srcset. Con intermedios (640, 960) el navegador baja menos de más: a 412 px y DPR 1.75 una
 * caja de 372 px necesita 651 px y antes saltaba de 480 (corto) a 768.
 */
const WIDTHS = [320, 480, 640, 768, 960, 1200, 1600] as const

/** Proporciones de los marcos de ShapedImage (--aspect-* de theme.css), para recortar en origen. */
export const BOX_ASPECT = { portrait: 4 / 5, photo: 3 / 2, wide: 16 / 9 } as const

/** Foto de Unsplash por id. width/height son las proporciones intrínsecas (evitan saltos de layout). */
export type Photo = {
  id: string
  /** Descriptivo si informa; "" si es decorativa. */
  alt: string
  width: number
  height: number
  /**
   * Proporción (ancho / alto) del original en Unsplash. Solo hace falta donde la caja cambia de
   * proporción según el ancho (galería, tarjeta destacada): ahí el recorte seguro depende del original.
   */
  sourceAspect?: number
}

/**
 * URL de una foto de Unsplash por id. Con `crop` (ancho / alto) se pide ya recortada al centro
 * (fit=crop, como object-cover): llegan solo los píxeles que se ven.
 */
export function unsplashUrl(id: string, width: number, quality = 70, crop?: number) {
  const height = crop ? `&h=${Math.round(width / crop)}` : ''
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}${height}&q=${quality}`
}

/**
 * URL absoluta en JPG, sin `auto=format` (que entrega WebP o AVIF según el navegador). Para los
 * consumidores que no negocian formato, como la `image` del JSON-LD.
 */
export function unsplashJpgUrl(id: string, width: number, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?fm=jpg&fit=crop&w=${width}&q=${quality}`
}

/** srcset con anchos estándar; el navegador elige según `sizes`. */
export function unsplashSrcSet(id: string, maxWidth = 1600, crop?: number) {
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${unsplashUrl(id, w, 70, crop)} ${w}w`)
    .join(', ')
}

/**
 * Recorte que no cambia el encuadre: una caja con object-cover muestra el centro del original; si se
 * recorta el origen a una proporción entre la del original y la de todas las cajas que lo muestran,
 * el área visible es la misma en cualquier ancho. `box` es la proporción de la caja o su rango
 * [mín, máx] medido de 320 a 1440 px. Sin `sourceAspect`, solo recorta si la caja es fija.
 */
export function safeCrop(photo: Photo, box: number | readonly [number, number]) {
  const [min, max] = typeof box === 'number' ? [box, box] : box
  if (min === max) return min
  if (!photo.sourceAspect) return undefined
  const crop = Math.min(max, Math.max(min, photo.sourceAspect))
  // Menos de un 2 % de diferencia con el original no ahorra nada: se pide tal cual
  return Math.abs(crop - photo.sourceAspect) / photo.sourceAspect < 0.02 ? undefined : crop
}

/**
 * Props listas para <img>/ShapedImage a partir de una Photo. No incluye `alt`: cada llamada lo
 * escribe explícito (`alt={photo.alt}` o `alt=""`) para que jsx-a11y/alt-text pueda verificarlo.
 * `crop`: proporción a la que se recorta en origen (ver safeCrop); sin él, la foto llega completa.
 */
export function photoProps(photo: Photo, sizes: string, maxWidth = 1600, crop?: number) {
  return {
    src: unsplashUrl(photo.id, Math.min(maxWidth, 1200), 70, crop),
    srcSet: unsplashSrcSet(photo.id, maxWidth, crop),
    sizes,
    width: photo.width,
    height: photo.height,
  }
}
