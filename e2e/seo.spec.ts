import { test, expect } from '@playwright/test'

test('JSON-LD: la image es la foto del hero, en JPG y con URL absoluta', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop-1440', 'Un solo proyecto basta: no depende del ancho')
  await page.goto('/')
  const json = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(json ?? '{}') as { image?: string }
  const image = new URL(data.image ?? '')
  expect(image.protocol).toBe('https:')
  expect(image.hostname).toBe('images.unsplash.com')
  expect(image.searchParams.get('fm')).toBe('jpg')
  expect(image.searchParams.has('auto')).toBe(false)
  // La del hero, no la imagen OG (maqueta)
  await expect(page.locator(`main img[src*="${image.pathname}"]`).first()).toBeAttached()
  expect(data.image).not.toContain('og-image')

  const response = await page.request.get(data.image ?? '')
  expect(response.headers()['content-type']).toBe('image/jpeg')
})

test('domicilio: solo «Zapopan, Jalisco» en el JSON-LD, el texto, el mapa y «Cómo llegar»', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop-1440', 'Un solo proyecto basta: no depende del ancho')
  await page.goto('/')
  const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}') as {
    address: Record<string, string>
  }
  expect(json.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Zapopan', addressRegion: 'Jalisco', addressCountry: 'MX' })

  const location = page.locator('#contacto')
  await expect(location.locator('address')).toHaveText('Zapopan, Jalisco')
  const query = 'Zapopan%2C%20Jalisco'
  await expect(location.locator('iframe')).toHaveAttribute('src', new RegExp(`q=${query}&`))
  await expect(location.getByRole('link', { name: /^Cómo llegar/ })).toHaveAttribute('href', new RegExp(`query=${query}$`))
})
