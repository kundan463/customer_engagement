import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `--mode artifact` emits one self-contained HTML file (no external JS/CSS
// requests), which is what the Artifact host and any static drop-in needs.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'artifact' ? [viteSingleFile()] : [])],
  base: './',
  build: {
    outDir: mode === 'artifact' ? 'dist-artifact' : 'dist',
    assetsInlineLimit: mode === 'artifact' ? 100_000_000 : 4096,
    cssCodeSplit: mode !== 'artifact',
  },
}))
