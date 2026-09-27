<script setup lang="ts">
import type { DemoItem } from '@/api/demo'
import { pickRouteParam, safeBack } from '@continew-app/core'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchDemoItem } from '@/api/demo'

const item = ref<DemoItem | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadDetail(id: number) {
  loading.value = true
  error.value = null
  try {
    item.value = await fetchDemoItem(id)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  }
  finally {
    loading.value = false
  }
}

function onRetry() {
  const id = Number(pickRouteParam('id'))
  if (id)
    loadDetail(id)
}

function onBack() {
  // safeBack 兜底：H5 刷新后 uni.navigateBack 会失效，兜底回列表页
  safeBack('/pages/components/index')
}

onLoad(() => {
  const id = Number(pickRouteParam('id'))
  if (id) {
    loadDetail(id)
  }
  else {
    error.value = '缺少条目 id'
  }
})
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <cm-page :loading="loading" :error="error" :empty="!loading && !item" @retry="onRetry">
        <view v-if="item" class="rounded-card bg-card p-5 shadow-card">
          <text class="block type-title text-main">
            {{ item.title }}
          </text>
          <text class="type-body mt-3 block text-secondary leading-relaxed">
            {{ item.summary }}
          </text>
          <view class="mt-5 h-px bg-divider" />
          <view class="mt-4 flex items-center justify-between">
            <text class="type-caption text-placeholder">
              条目 ID
            </text>
            <text class="type-caption text-secondary num">
              #{{ item.id }}
            </text>
          </view>
          <view class="mt-2 flex items-center justify-between">
            <text class="type-caption text-placeholder">
              数据来源
            </text>
            <text class="type-caption text-secondary">
              packages/server 演示接口
            </text>
          </view>
        </view>

        <view class="mt-6 flex justify-center">
          <wd-button block plain @click="onBack">
            返回列表（safeBack 演示）
          </wd-button>
        </view>
      </cm-page>
    </view>
  </DemoTheme>
</template>
