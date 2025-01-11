// Ignore vite typescript error
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import dts from 'vite-plugin-dts';

// Adding proper type for the format parameter
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    dts()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'] as const,
      fileName: (format: string) => `index.${format}.js`
    }
  }
});