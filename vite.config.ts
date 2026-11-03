import { appendFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, runnerImport, type HtmlTagDescriptor, type Plugin } from 'vite'

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) }

type StructuredDataModule = {
  structuredData: (siteUrl: string) => object
  STRUCTURED_DATA_DEMO_FIELDS: string[]
}

/**
 * SEO de index.html: inyecta el JSON-LD (src/lib/structuredData.ts, con el copy de content/landing.ts) y,
 * solo si hay dominio en VITE_SITE_URL, canonical, og:url, sitemap.xml y la línea Sitemap de robots.txt.
 */
function seo(siteUrl: string): Plugin {
  let data: Promise<StructuredDataModule> | undefined
  const load = () =>
    (data ??= runnerImport<StructuredDataModule>(fileURLToPath(new URL('./src/lib/structuredData.ts', import.meta.url)), {
      configFile: false,
      resolve: { alias },
    }).then((result) => result.module))

  return {
    name: 'casa-alcanfor:seo',
    async transformIndexHtml(html, ctx) {
      if (ctx.path !== '/index.html') return html
      const { structuredData, STRUCTURED_DATA_DEMO_FIELDS } = await load()
      const json = JSON.stringify(structuredData(siteUrl), null, 2).replace(/</g, '\\u003c')
      const demo = `<!-- JSON-LD · DEMO: ${STRUCTURED_DATA_DEMO_FIELDS.join(', ')} son datos de ejemplo (content/landing.ts) -->`
      const tags: HtmlTagDescriptor[] = []
      if (siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
        )
      }
      return {
        html: html.replace(/\s*<\/head>/, `\n    ${demo}\n    <script type="application/ld+json">\n${json}\n    </script>\n  </head>`),
        tags,
      }
    },
    writeBundle(options) {
      if (!siteUrl || !options.dir) return
      writeFileSync(
        join(options.dir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`,
      )
      appendFileSync(join(options.dir, 'robots.txt'), `\nSitemap: ${siteUrl}/sitemap.xml\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const siteUrl = (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? '').replace(/\/+$/, '')
  return {
    plugins: [react(), tailwindcss(), seo(siteUrl)],
    resolve: { alias },
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          designSystem: fileURLToPath(new URL('./design-system.html', import.meta.url)),
        },
      },
    },
  }
})
