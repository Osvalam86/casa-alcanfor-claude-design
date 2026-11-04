import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, runnerImport, type HtmlTagDescriptor, type Plugin } from 'vite'

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) }

/** Imagen OG de public/ (pnpm og la regenera con capturas del sitio). */
const OG_IMAGE = '/og-image.png'

type StructuredDataModule = {
  structuredData: (siteUrl: string) => object
  STRUCTURED_DATA_DEMO_FIELDS: string[]
}

/**
 * SEO de index.html: inyecta el JSON-LD (src/lib/structuredData.ts, con el copy de content/landing.ts) y,
 * solo si hay dominio en VITE_SITE_URL, canonical, og:url y og:image/twitter:image absolutas.
 * Sin sitemap.xml ni línea Sitemap en robots.txt: el sitio lleva noindex.
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
      // Open Graph pide URL absoluta: con dominio, /og-image.png pasa a ${siteUrl}/og-image.png
      const withImage = siteUrl ? html.replaceAll(`content="${OG_IMAGE}"`, `content="${siteUrl}${OG_IMAGE}"`) : html
      return {
        html: withImage.replace(/\s*<\/head>/, `\n    ${demo}\n    <script type="application/ld+json">\n${json}\n    </script>\n  </head>`),
        tags,
      }
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
