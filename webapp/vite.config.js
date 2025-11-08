import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../shared'),
      '@qr': resolve(__dirname, '../shared/qr/qrGenerator.js'),
      '@src': resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '../shared')],
    },
  },
  optimizeDeps: {
    include: ['qrcode-generator'],
  },
});
