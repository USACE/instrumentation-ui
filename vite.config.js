import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
// eslint-disable-next-line import/default
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    visualizer({
      filename: 'rollup-analyze.json',
      template: 'raw-data',
      gzipSize: true,
      brotliSize: true,
    }),
    checker({
      eslint: {
        typescript: false,
        lintCommand: 'eslint "./src/**/*.{js,jsx}"',
      },
      overlay: {
        initialIsOpen: false,
        position: 'br',
      },
    }),
  ],
  css: {
    devSourcemap: false,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  server: {
    open: true,
    port: 3000,
  },
});
