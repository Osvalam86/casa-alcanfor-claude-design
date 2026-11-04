/**
 * Separadores solo para lector de pantalla, entre piezas de texto que en pantalla van en líneas o
 * bloques distintos (flex, sr-only). Chrome no inserta espacio entre esos bloques en los nodos de texto
 * que lee NVDA en modo exploración, que los leía pegados ("Casa AlcanforJARDÍN & SALÓN"). Usan el
 * espacio de no separación (U+00A0) porque un espacio normal al borde de un texto oculto se colapsa
 * y no llega al árbol de accesibilidad. Se escribe con fromCharCode para que se vea en el código.
 */
export const NBSP = String.fromCharCode(0xa0)
export const SR_SEPARATOR = `,${NBSP}`
export const SR_SPACE = NBSP
