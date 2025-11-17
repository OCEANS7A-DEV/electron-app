// @ts-nocheck
import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('renderer/src'),
        '@InvAmount': resolve('src/renderer/src/router/inventory/InventoryAmount'),
        '@Inventory': path.resolve(__dirname, 'src/renderer/src/router/inventory')
      }
    },
    plugins: [
      react(),
      tsconfigPaths()
    ]
  }
}) 
