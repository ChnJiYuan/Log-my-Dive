import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Log my Dive',
        short_name: 'Log my Dive',
        description: 'Your personal dive logbook',
        theme_color: '#0A2342',
        background_color: '#0A2342',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@log-my-dive/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@log-my-dive/adapters': resolve(__dirname, '../../packages/adapters/src/index.ts'),
    },
  },
});
