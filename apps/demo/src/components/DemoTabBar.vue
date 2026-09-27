<script setup lang="ts">
import { onMounted } from 'vue'

defineOptions({ name: 'DemoTabBar' })

const props = withDefaults(defineProps<{
  /** 当前激活项 key */
  current: string
}>(), {})

// tabBar.custom 仅微信小程序生效：H5 / App 端原生 tabbar 仍会渲染（白底、无图标、
// 颜色取 pages.json 静态值），会压在 wd-tabbar 上——主动隐藏，让自定义栏接管。
onMounted(() => {
  // #ifdef H5 || APP-PLUS
  uni.hideTabBar({ fail: () => {} })
  // #endif
})

interface TabItem {
  key: string
  text: string
  icon: string
  path: string
}

const tabs: TabItem[] = [
  { key: 'home', text: '首页', icon: 'home', path: '/pages/home/index' },
  { key: 'components', text: '组件', icon: 'apps', path: '/pages/components/index' },
  { key: 'profile', text: '我的', icon: 'user', path: '/pages/profile/index' },
]

function switchTab(item: TabItem) {
  if (item.key === props.current)
    return
  uni.switchTab({ url: item.path })
}
</script>

<template>
  <wd-tabbar fixed safe-area-inset-bottom placeholder :model-value="current">
    <wd-tabbar-item
      v-for="item in tabs"
      :key="item.key"
      :name="item.key"
      :title="item.text"
      :icon="item.icon"
      @click="switchTab(item)"
    />
  </wd-tabbar>
</template>
