<script setup lang="ts">
defineOptions({ name: 'DemoTabBar' })

const props = withDefaults(defineProps<{
  /** 当前激活项 key */
  current: string
}>(), {})

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
