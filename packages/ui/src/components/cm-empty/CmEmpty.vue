<script setup lang="ts">
defineOptions({ name: 'CmEmpty' })

withDefaults(defineProps<{
  /** 空态文案 */
  text?: string
}>(), {
  text: '暂无数据',
})
</script>

<template>
  <view class="cm-empty flex flex-col items-center justify-center py-16">
    <wd-icon name="inbox" size="96rpx" color="var(--wot-text-placeholder)" />
    <!-- 死类警告：正确短名是 text-auxiliary，写成 text-color-auxiliary 不报错、不告警，
         但生成的 CSS 为空——文字颜色会静默失效。改类名前先确认消费方 uno.config 里有这条 shortcut。 -->
    <text class="mt-4 text-sm text-auxiliary">
      {{ text }}
    </text>
    <slot />
  </view>
</template>
