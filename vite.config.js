import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteyaml from '@modyfi/vite-plugin-yaml'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    dedupe: Object.keys(pkg.dependencies),
  },
  plugins: [react(), viteyaml()],
  build: {
    outDir: 'dist',
    manifest: 'asset-manifest.json',
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    environment: 'jsdom',
    //setupFiles: ['./src/setupTest.jsx'],
    testMatch: ['./src/**/*.test.jsx'],
    globals: true,
  },
})
