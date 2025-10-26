// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 这里指定端口为 3000
    strictPort: true, // 强制使用指定端口，如果被占用则报错（可选）
  }
})