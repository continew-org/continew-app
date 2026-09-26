import { defineConfig } from '@uni-helper/unh'

export default defineConfig({
  platform: {
    default: 'h5',
    alias: {
      'h5': ['w', 'h'],
      'mp-weixin': 'wx',
    },
  },
  // manifest.config.ts → dev/build 时由 unh 前置生成 src/manifest.json（appid 走 env，不提交真实值）。
  // 依赖 @uni-helper/vite-plugin-uni-manifest 必须保留（unh 通过 isPackageExists 检测它来启用生成），
  // 但不要把它注册为 vite 插件——插件路线生成时机晚于 uni 读取 manifest.json，会报 ENOENT。
  autoGenerate: {
    manifest: true,
  },
})
