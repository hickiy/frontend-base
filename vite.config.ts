import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from "unplugin-auto-import/vite";
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'



// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.ts', '.tsx', '.vue']
  },
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({}),
    AutoImport({
      // 自动导入vue相关的Api
      imports: ["vue"],
      dts: 'auto-imports.d.ts',
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
})
