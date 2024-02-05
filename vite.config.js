import path from 'path';
import createVitePlugins from './vite';
import autoprefixer from 'autoprefixer';
import px2rem from 'postcss-pxtorem';
import { defineConfig, loadEnv } from 'vite';
import { baseRemUnit } from './src/config.js'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        '/api-server': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api-server/, '')
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          px2rem({ rootValue: baseRemUnit, propList: ['*', '!min-*', '!--*'] }),
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  };
});
