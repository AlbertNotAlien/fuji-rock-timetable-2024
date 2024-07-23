import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, '/index.html'),
        26: resolve(__dirname, '/26.html'),
        27: resolve(__dirname, '/27.html'),
        28: resolve(__dirname, '/28.html'),
      },
    },
  },
});
