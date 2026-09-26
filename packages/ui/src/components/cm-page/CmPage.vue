<script setup lang="ts">
import CmEmpty from '../cm-empty/CmEmpty.vue'

defineOptions({ name: 'CmPage' })

withDefaults(defineProps<{
  /** 加载中（骨架/loading 态） */
  loading?: boolean
  /** 错误文案（非空即错误态） */
  error?: string | null
  /** 是否为空态（由调用方按数据判断） */
  empty?: boolean
  /** 空态文案 */
  emptyText?: string
}>(), {
  loading: false,
  error: null,
  empty: false,
  emptyText: '暂无数据',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <view class="cm-page min-h-full">
    <!-- 加载态 -->
    <view v-if="loading" class="flex items-center justify-center py-24">
      <wd-loading size="40rpx" />
    </view>

    <!-- 错误态 -->
    <view v-else-if="error" class="flex flex-col items-center justify-center py-24">
      <text class="text-sm text-color-secondary">
        {{ error }}
      </text>
      <wd-button class="mt-6" size="small" plain @click="emit('retry')">
        重试
      </wd-button>
    </view>

    <!-- 空态 -->
    <slot v-else-if="empty" name="empty">
      <CmEmpty :text="emptyText" />
    </slot>

    <!-- 正常内容 -->
    <slot v-else />
  </view>
</template>
