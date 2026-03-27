import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

/** GitHub project Pages lives at /repo-name/; CI sets VITE_BASE_PATH=/three-dreams/ */
function viteBase(): string {
  const p = process.env.VITE_BASE_PATH?.trim()
  if (p == null || p === '' || p === '/') return '/'
  const lead = p.startsWith('/') ? p : `/${p}`
  return lead.endsWith('/') ? lead : `${lead}/`
}

/** GitHub Pages serves 404 for unknown paths; copy index.html so Vue Router can boot on refresh. */
function ghPagesSpaFallback(base: string): Plugin {
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      if (base === '/') return
      const out = resolve(process.cwd(), 'dist')
      const indexHtml = resolve(out, 'index.html')
      const notFound = resolve(out, '404.html')
      if (existsSync(indexHtml)) copyFileSync(indexHtml, notFound)
    },
  }
}

const disablePwa =
  process.env.VITE_DISABLE_PWA === '1' || process.env.VITE_DISABLE_PWA === 'true'

export default defineConfig(({ mode }) => {
  const base = viteBase()
  /** App root (three-dreams/). Linked `@base/*` packages resolve under ../SHARED — allow FS + avoid broken `import.meta.url` in deps. */
  const appRoot = fileURLToPath(new URL('.', import.meta.url))
  const sharedRoot = resolve(appRoot, '../SHARED')

  return {
    base,
    plugins: [
      vue(),
      !disablePwa &&
        mode !== 'electron' &&
        VitePWA({
          registerType: 'autoUpdate',
          /** Avoid 404s for icons not present under public/ */
          includeAssets: [],
          scope: base,
          manifest: {
            name: 'three-dreams',
            short_name: 'dreams',
            description: 'Three Dreams — Scene 1 · @base stack',
            theme_color: '#09090b',
            background_color: '#09090b',
            display: 'standalone',
            start_url: base,
            scope: base,
          },
          workbox: {
            navigateFallback: `${base}index.html`,
            navigateFallbackDenylist: [/^\/api\//],
          },
        }),
      ghPagesSpaFallback(base),
    ].filter(Boolean) as Plugin[],
    resolve: {
      dedupe: ['three'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      fs: {
        allow: [appRoot, sharedRoot],
      },
    },
    optimizeDeps: {
      include: ['three', '@base/threejs-engine'],
      /**
       * `@base/player-three` builds FBX URLs with `new URL('../assets/...', import.meta.url)`.
       * Pre-bundling into `.vite/deps` rewires `import.meta.url` to the chunk path → wrong asset base → 404 clips → T-pose.
       */
      exclude: ['@base/player-three'],
    },
  }
})
