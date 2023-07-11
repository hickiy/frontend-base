import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/base/' : '/',
  build: {
    outDir: 'base'
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/base-api': {
        target: 'http://vue.ruoyi.vip/prod-api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/base-api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/css/var.scss" as *;`
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        'vue'
      ],
      dts: 'auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ],
      dts: 'components.d.ts'
    }),
    // 启动配置检视页面
    Inspect()
  ]
});
