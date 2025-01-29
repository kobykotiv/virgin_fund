import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: "/",
  plugins: [
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    dts(),
  ],
  server: {
    port: 5173,
    host: true, // Needed for devcontainer
    cors: true,
    proxy: {
      // Add proxy for yahoo-finance API if needed
      // '/api/yahoo': {
      //   target: 'https://query2.finance.yahoo.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      // },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    // Remove lib configuration to use standard application build
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
