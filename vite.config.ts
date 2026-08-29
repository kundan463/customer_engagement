import { rm } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * `public/audio-review.html` is an internal sheet for listening to the demo
 * clips against their transcripts (written by `scripts/tts-generate.mjs`).
 * It has to live in `public/` so the dev server can serve it, but it has no
 * business being deployed, so drop it from the build output.
 */
function dropInternalPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'drop-internal-pages',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir },
    async closeBundle() {
      await rm(path.resolve(outDir, 'audio-review.html'), { force: true })
    },
  }
}

// `--mode artifact` emits one self-contained HTML file (no external JS/CSS
// requests), which is what the Artifact host and any static drop-in needs.
export default defineConfig(({ mode }) => ({
  plugins: [react(), dropInternalPages(), ...(mode === 'artifact' ? [viteSingleFile()] : [])],
  base: './',
  build: {
    outDir: mode === 'artifact' ? 'dist-artifact' : 'dist',
    assetsInlineLimit: mode === 'artifact' ? 100_000_000 : 4096,
    cssCodeSplit: mode !== 'artifact',
  },
}))
