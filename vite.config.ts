import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Inspect from "vite-plugin-inspect";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://vue.ruoyi.vip",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": pathSrc,
    },
    extensions: [".js", ".ts", ".tsx", ".vue"],
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        "vue",
      ],
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
      ],
      dts: "auto-imports.d.ts",
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      dts: "components.d.ts",
    }),
    // 启动配置检视页面
    Inspect(),
  ],
});
