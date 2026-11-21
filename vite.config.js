import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the build work from any folder or sub-path (GitHub Pages, Netlify, Vercel).
// The site is built into docs/ because GitHub Pages can publish straight from that folder.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('@react-three') || id.includes('postprocessing') || id.includes('three-stdlib') || id.includes('troika')) return 'r3f'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion'
        },
      },
    },
  },
})
