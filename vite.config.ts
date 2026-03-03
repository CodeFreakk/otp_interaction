import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** Resolve figma:asset/... imports for local dev (Figma Make assets only exist in Figma). */
const FIGMA_ASSET_VIRTUAL_ID = '\0figma-asset-placeholder'

function figmaAssetPlugin() {
  const placeholderUrl = '/figma-asset-placeholder.svg'
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) return FIGMA_ASSET_VIRTUAL_ID
    },
    load(id: string) {
      if (id === FIGMA_ASSET_VIRTUAL_ID) {
        return `export default ${JSON.stringify(placeholderUrl)}`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
