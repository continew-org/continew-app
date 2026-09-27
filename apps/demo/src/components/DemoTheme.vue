<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import { useTheme } from '@/composables/use-theme'

/**
 * 页面主题包裹层：每个页面的根容器，负责两件事——
 * 1. 把当前主题挂到 DOM 上（wd-config-provider 的 wot-theme-* class + 品牌色阶变量）
 * 2. 铺一层页面底色（bg-page）
 *
 * 为什么不放在 App.vue：小程序端每个页面是独立 Page，App.vue 的模板不会渲染进页面，
 * 包在那里只有 H5 生效——看起来做了、实际上三端里只有一端生效，是最难发现的那种 bug。
 * 放在页面根组件里，三端行为一致。
 * （若后续接受引入 @uni-ku/root，可退回 App.vue 只包一次，本组件即可删除。）
 */
const { theme, themeVars, listenSystemTheme } = useTheme()

onMounted(listenSystemTheme)

// 导航栏 / 原生页面底色跟随应用内主题：pages.json 的 darkmode+theme.json 只跟随系统，
// 用户在应用内手动切到暗色（系统仍是亮色）时原生层不会跟——这里是唯一能三端同步的地方。
// 色值与 tokens.css 的亮暗两态保持一致（uni API 只收字符串，无法引用 CSS 变量）。
watchEffect(() => {
  const dark = theme.value === 'dark'
  uni.setNavigationBarColor({
    frontColor: dark ? '#ffffff' : '#000000',
    backgroundColor: dark ? '#1d1f29' : '#ffffff',
    fail: () => {},
  })
  uni.setBackgroundColor({ backgroundColor: dark ? '#1d1f29' : '#f7f8fa' })
})
</script>

<template>
  <wd-config-provider :theme="theme" :theme-vars="themeVars">
    <view class="min-h-screen bg-page">
      <slot />
    </view>
  </wd-config-provider>
</template>
