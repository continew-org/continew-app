import path from 'node:path'
import process from 'node:process'
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { loadEnv } from 'vite'

/**
 * manifest.json 由本文件在 dev/build 时经 unh 的 autoGenerate.manifest 前置生成，
 * 请勿手改 src/manifest.json——改动会被覆盖（该文件已 gitignore）。
 *
 * appid 走环境变量（apps/demo/.env，已 gitignore，不提交真实值）：
 * - VITE_UNI_APPID：uni 应用 appid（__UNI__xxx，DCloud 应用标识，仅 App 云端打包/uni 统计时需要）
 * - VITE_WX_APPID：微信小程序 appid（仅发布微信小程序时需要，绑定你的小程序主体）
 * H5 / 微信小程序本地开发均无需 appid，留空即可；正式发布前在本地 .env 填自己的真实值。
 */
function getMode() {
  const args = process.argv.slice(2)
  const modeFlagIndex = args.findIndex(arg => arg === '--mode')
  return modeFlagIndex !== -1 ? args[modeFlagIndex + 1] : args[0] === 'build' ? 'production' : 'development'
}

// .env 位于 apps/demo 根（unh 以前置进程运行，cwd 即 apps/demo）
const { VITE_UNI_APPID, VITE_WX_APPID } = loadEnv(getMode(), path.resolve(process.cwd()))

export default defineManifestConfig({
  'name': 'ContiNew App',
  'appid': VITE_UNI_APPID ?? '',
  'description': '面向 vibe coding 的 uni-app 多端工程底座',
  'versionName': '0.1.0',
  'versionCode': 100,
  'transformPx': false,
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    modules: {},
    distribute: {
      android: {
        permissions: [],
      },
      ios: {},
      sdkConfigs: {},
    },
  },
  'quickapp': {},
  'mp-weixin': {
    usingComponents: true,
    setting: {
      urlCheck: false,
      es6: true,
      postcss: true,
      minified: true,
    },
    appid: VITE_WX_APPID ?? '',
    darkmode: true,
    themeLocation: 'theme.json',
  },
  'h5': {
    darkmode: true,
    themeLocation: 'theme.json',
    title: 'ContiNew App',
    router: {
      mode: 'history',
    },
  },
})
