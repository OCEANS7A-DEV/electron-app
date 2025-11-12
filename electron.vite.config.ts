import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
//import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'


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
        '@renderer': resolve('src/renderer/src'),
        '@InvAmount': resolve('src/renderer/src/router/inventory/InventoryAmount')
      }
    },
    plugins: [
      vue()
    ]
  }
}) 
