<script setup lang="ts">
import type { DemoItem } from '@/api/demo'
import { confirmDelete, useList } from '@continew-app/core'
import { fetchDemoItems } from '@/api/demo'
import { feedback } from '@/api/feedback'

const { list, loading, error, refresh } = useList<DemoItem>({
  fetcher: async (page, size) => {
    const res = await fetchDemoItems(page, size)
    return res.items
  },
  size: 8,
})

async function onDelete(item: DemoItem) {
  if (await confirmDelete({ content: `确定删除「${item.title}」吗？` })) {
    feedback.success('已删除（演示）')
  }
}

function goDetail(item: DemoItem) {
  uni.navigateTo({ url: `/pages/detail/index?id=${item.id}` })
}
</script>

<template>
  <view class="px-4 pb-8 pt-4">
    <cm-page :loading="loading && list.length === 0" :error="error" :empty="!loading && list.length === 0" @retry="refresh">
      <wd-cell-group border>
        <wd-cell
          v-for="item in list"
          :key="item.id"
          :title="item.title"
          label="点击查看详情；长按删除（演示 confirmDelete）"
          is-link
          @click="goDetail(item)"
          @longpress="onDelete(item)"
        />
      </wd-cell-group>

      <view v-if="loading && list.length > 0" class="flex justify-center py-4">
        <wd-loading size="32rpx" />
      </view>
      <view v-else-if="!loading" class="py-4 text-center">
        <text class="text-xs text-placeholder">
          没有更多了
        </text>
      </view>
    </cm-page>

    <DemoTabBar current="components" />
  </view>
</template>
