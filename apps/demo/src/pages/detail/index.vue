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
  <view class="px-4 pb-8 pt-4">
    <cm-page :loading="loading" :error="error" :empty="!loading && !item" @retry="onRetry">
      <wd-card v-if="item" :title="item.title">
        <text class="text-sm text-secondary">
          {{ item.summary }}
        </text>
        <view class="mt-4">
          <text class="text-xs text-placeholder">
            ID：{{ item.id }}
          </text>
        </view>
      </wd-card>

      <view class="mt-6 flex justify-center">
        <wd-button plain @click="onBack">
          返回列表（safeBack 演示）
        </wd-button>
      </view>
    </cm-page>
  </view>
</template>
