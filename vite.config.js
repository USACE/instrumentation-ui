import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const basePath = process.env.VITE_URL_BASE_PATH

  return defineConfig({
    base: basePath === '' ? '/' : basePath,
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
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  });
}
