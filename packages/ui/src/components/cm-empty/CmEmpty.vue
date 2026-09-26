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
    <text class="mt-4 text-sm text-color-auxiliary">
      {{ text }}
    </text>
    <slot />
  </view>
</template>
