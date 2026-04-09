import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  publicDir: 'static',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-utils': ['jspdf', 'html2pdf.js', 'framer-motion', 'lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    outDir: 'dist'
  }
})

