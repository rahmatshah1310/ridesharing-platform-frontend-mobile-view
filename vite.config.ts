import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "@raahi/assets": path.resolve(__dirname, "./src/assets"),
      "@raahi/components": path.resolve(__dirname, "./src/components/components.ts"),
      "@raahi/constants": path.resolve(__dirname, "./src/constants/constants.ts"),
      "@raahi/pages": path.resolve(__dirname, "./src/pages/pages.ts"),
      "@raahi/layouts": path.resolve(__dirname, "./src/layouts/layouts.ts"),
      "@raahi/types": path.resolve(__dirname, "./src/types/types.ts"),
      "@raahi/services": path.resolve(__dirname, "./src/services/services.ts"),
      "@raahi/context": path.resolve(__dirname, "./src/context/context.ts"),
      "@raahi/utils": path.resolve(__dirname, "./src/utils/utils.ts"),
      "@raahi/hooks": path.resolve(__dirname, "./src/hooks/hooks.ts"),
      "@raahi/api": path.resolve(__dirname, "./src/api/api.ts"),
      "@raahi/routes": path.resolve(__dirname, "./src/routes/routes.ts"),
    }
  },
  plugins: [react(), tailwindcss()],
})
