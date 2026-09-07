import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { cloudflare } from "@cloudflare/vite-plugin" // new

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cloudflare(), // new
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // appType: 'spa', 
  // server: {
  //   port: 5173,
  //   // 2. Ensuring the port never changes (keeps Google OAuth happy)
  //   strictPort: true,
  // }
})
