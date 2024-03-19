import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteyaml from '@modyfi/vite-plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteyaml()],
  build: {
    outDir: 'dist',
    manifest: 'asset-manifest.json',
  },
})
