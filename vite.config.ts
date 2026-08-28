import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // GitHub Pages project sites are served from /<repo-name>/, not the domain
  // root — set VITE_BASE_PATH in .env.demo to match your actual repo name.
  // The real (Vercel) build never sets this, so it defaults to root.
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/*.png'],
        manifest: {
          name: env.VITE_DEMO_MODE === 'true' ? 'Expense Manager — Demo' : 'Expense Manager — Your Spending Companion',
          short_name: env.VITE_DEMO_MODE === 'true' ? 'Expenses Demo' : 'Expenses',
          description: 'A calm, private way to understand where your money goes.',
          theme_color: '#3D3247',
          background_color: '#FBF8F6',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            { src: `${base}icons/icon-192.png`.replace('//', '/'), sizes: '192x192', type: 'image/png' },
            { src: `${base}icons/icon-512.png`.replace('//', '/'), sizes: '512x512', type: 'image/png' },
            { src: `${base}icons/icon-512-maskable.png`.replace('//', '/'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']
        }
      })
    ]
  };
})
