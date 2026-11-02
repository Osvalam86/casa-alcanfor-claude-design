const WIDTHS = [480, 768, 1200, 1600] as const

/** Foto de Unsplash por id. width/height son las proporciones intrínsecas (evitan saltos de layout). */
export type Photo = {
  id: string
  /** Descriptivo si informa; "" si es decorativa. */
  alt: string
  width: number
  height: number
}

/** Construye la URL de una foto de Unsplash por id con recorte y calidad del diseño. */
export function unsplashUrl(id: string, width: number, quality = 70) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

/** srcset con anchos estándar; el navegador elige según `sizes`. */
export function unsplashSrcSet(id: string, maxWidth = 1600) {
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${unsplashUrl(id, w)} ${w}w`)
    .join(', ')
}

/**
 * Props listas para <img>/ShapedImage a partir de una Photo. No incluye `alt`: cada llamada lo
 * escribe explícito (`alt={photo.alt}` o `alt=""`) para que jsx-a11y/alt-text pueda verificarlo.
 */
export function photoProps(photo: Photo, sizes: string, maxWidth = 1600) {
  return {
    src: unsplashUrl(photo.id, Math.min(maxWidth, 1200)),
    srcSet: unsplashSrcSet(photo.id, maxWidth),
    sizes,
    width: photo.width,
    height: photo.height,
  }
}
