import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

/**
 * A unique build label for this bundle (not semver — identifies *this* deploy / artifact).
 *
 * Resolution order:
 * 1. `VITE_BUILD_ID` or `BUILD_ID` — set in CI to anything monotonic (increment, full SHA, etc.)
 * 2. Short git SHA from common CI env vars, or `git rev-parse --short HEAD`, optionally suffixed with CI build number e.g. ` (#42)`
 * 3. CI build number alone if no SHA
 * 4. `local` when developing outside a git/CI context
 */
function resolveBuildId() {
  const explicit = process.env.VITE_BUILD_ID?.trim() || process.env.BUILD_ID?.trim()
  if (explicit) return explicit

  const fullSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA ||
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.COMMIT_REF ||
    process.env.NETLIFY_COMMIT_REF ||
    ''

  const shortFromEnv = fullSha.trim().length >= 7 ? fullSha.trim().slice(0, 7) : ''

  let shortSha = shortFromEnv
  if (!shortSha) {
    try {
      shortSha = execSync('git rev-parse --short HEAD', {
        encoding: 'utf-8',
        cwd: projectRoot,
      }).trim()
    } catch {
      shortSha = ''
    }
  }

  const buildNum =
    process.env.GITHUB_RUN_NUMBER ||
    process.env.CI_PIPELINE_IID ||
    process.env.BUILD_NUMBER ||
    process.env.CIRCLE_BUILD_NUM ||
    ''

  const n = buildNum ? String(buildNum).trim() : ''

  if (shortSha && n) return `${shortSha} (#${n})`
  if (shortSha) return shortSha
  if (n) return `#${n}`
  return 'local'
}

const buildStamp = new Date().toISOString()

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(resolveBuildId()),
    __BUILD_STAMP__: JSON.stringify(buildStamp),
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Multiply & Divide',
        short_name: 'Multiply & Divide',
        description: 'Practise multiplication and division facts',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
