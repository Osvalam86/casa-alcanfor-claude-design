import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { revealAll } from './helpers'

const PAGES = ['/', '/design-system.html']

for (const path of PAGES) {
  test(`axe sin violaciones serious/critical en ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await revealAll(page)

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()
    const describe = (v: (typeof results.violations)[number]) =>
      `${v.impact} · ${v.id} · ${v.nodes.length} nodo(s): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`
    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map(describe)
    test.info().annotations.push({ type: 'axe', description: results.violations.map(describe).join('\n') || 'sin violaciones' })
    expect(blocking).toEqual([])
    // Todo el contenido vive en landmarks (capas fijas dentro del <footer>)
    expect(results.violations.filter((v) => v.id === 'region').map(describe)).toEqual([])
  })
}
