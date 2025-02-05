import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define the configuration for Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias for the components folder
      '@components': path.resolve(__dirname, 'src/components'),
      // You can add more aliases here if needed
    },
  },
});
