import { fileURLToPath, URL } from 'node:url'
import Uni from '@uni-helper/plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { WotResolver } from './src/resolvers/wot-ui-resolver'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // pinia 3 静态导入 @vue/devtools-api（完整实现由浏览器 Vue DevTools 扩展运行时注入），
      // 在 uni-app 三端构建中 alias 到空实现 stub，避免 Rollup 解析失败且不在产物中残留裸模块引用
      '@vue/devtools-api': fileURLToPath(new URL('./src/stubs/devtools.ts', import.meta.url)),
      '@vue/devtools-kit': fileURLToPath(new URL('./src/stubs/devtools.ts', import.meta.url)),
      '@vue/devtools-shared': fileURLToPath(new URL('./src/stubs/devtools.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@wot-ui/ui'],
  },
  plugins: [
    // 须在 Uni() 之前
    Components({
      resolvers: [WotResolver()],
      dts: 'src/components.d.ts',
      dirs: ['src/components'],
    }),
    Uni(),
    UnoCSS(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // vite 5.2.8 仅支持 dart-sass（`sass`），不支持 5.4+ 的 modern-compiler api / sass-embedded
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
