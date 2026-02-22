import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const sdUrl = env.VITE_SD_API_URL || 'http://127.0.0.1:7860';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/sd-api': {
            target: sdUrl,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/sd-api/, ''),
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
