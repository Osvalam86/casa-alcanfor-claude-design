import { test, expect } from '@playwright/test'

/**
 * Entrega de imágenes (Lighthouse: «Mejora la entrega de imágenes»). El sizes de cada foto debe cubrir lo
 * que se pinta sin pedir de más: con object-cover, la imagen se pinta a max(ancho de la caja, alto × su
 * proporción), por la escala del transform (el hero tiene scale-115). Si cambia una rejilla o un token de
 * espaciado y el sizes deja de corresponder, esta prueba falla.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
})

test('sizes de cada imagen: cubre lo que se pinta y no pide más de un 30 % de más', async ({ page }) => {
  const rows = await page.evaluate(async () => {
    // Separa por comas fuera de paréntesis: calc((92vw - 48px) / 3) tiene paréntesis anidados
    const splitTop = (s: string) => {
      const parts: string[] = []
      let depth = 0
      let cur = ''
      for (const ch of s) {
        if (ch === '(') depth++
        if (ch === ')') depth--
        if (ch === ',' && depth === 0) {
          parts.push(cur.trim())
          cur = ''
        } else cur += ch
      }
      return [...parts, cur.trim()]
    }
    // Evalúa sizes como el navegador: la primera condición que se cumple da la longitud
    const evalSizes = (sizes: string) => {
      for (const part of splitTop(sizes)) {
        let len = part
        if (part.startsWith('(')) {
          let depth = 0
          let i = 0
          for (; i < part.length; i++) {
            if (part[i] === '(') depth++
            if (part[i] === ')' && --depth === 0) break
          }
          if (!matchMedia(part.slice(0, i + 1)).matches) continue
          len = part.slice(i + 1).trim()
        }
        const probe = document.createElement('div')
        probe.style.cssText = `position:absolute;visibility:hidden;width:${len}`
        document.body.append(probe)
        const width = probe.getBoundingClientRect().width
        probe.remove()
        return width
      }
      return 0
    }
    const imgs = [...document.querySelectorAll<HTMLImageElement>('main img[sizes]')]
    imgs.forEach((img) => (img.loading = 'eager'))
    await Promise.all(imgs.map((img) => img.decode().catch(() => undefined)))
    return imgs.map((img) => {
      const scale = img.offsetWidth ? img.getBoundingClientRect().width / img.offsetWidth : 1
      const served = img.naturalWidth / img.naturalHeight
      const cover = getComputedStyle(img).objectFit === 'cover'
      const need = (cover ? Math.max(img.offsetWidth, img.offsetHeight * served) : img.offsetWidth) * scale
      const label = img.alt || img.closest('button')?.getAttribute('aria-label') || img.currentSrc
      return { label, need: Math.round(need), sizes: Math.round(evalSizes(img.getAttribute('sizes') ?? '')) }
    })
  })

  expect(rows.length).toBeGreaterThan(20)
  const off = rows.filter((r) => r.sizes < r.need * 0.98 || r.sizes > r.need * 1.3).map((r) => `${r.label}: se pinta a ${r.need} px y sizes da ${r.sizes} px`)
  expect(off, off.join('\n')).toEqual([])
})

test('el lightbox cerrado no descarga ninguna foto', async ({ page }) => {
  await expect(page.locator('dialog img')).toHaveCount(0)
  await page.getByRole('button', { name: /^Ampliar foto/ }).first().click()
  await expect(page.getByRole('dialog', { name: 'Galería de fotos' }).getByRole('img')).toHaveCount(1)
})
