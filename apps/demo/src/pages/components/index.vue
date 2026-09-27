<script setup lang="ts">
import type { DemoItem } from '@/api/demo'
import { confirmDelete, useList } from '@continew-app/core'
import { onShow } from '@dcloudio/uni-app'
import { consumeListDirty, deleteDemoItem, fetchDemoItems, markListDirty } from '@/api/demo'
import { feedback } from '@/api/feedback'

const { list, loading, error, refresh } = useList<DemoItem>({
  fetcher: async (page, size) => {
    const res = await fetchDemoItems(page, size)
    return res.items
  },
  size: 8,
})

// 表单页（新增 / 编辑）保存后返回时刷新列表
onShow(() => {
  if (consumeListDirty())
    refresh()
})

function goCreate() {
  uni.navigateTo({ url: '/pages/form/index' })
}

function goDetail(item: DemoItem) {
  uni.navigateTo({ url: `/pages/detail/index?id=${item.id}` })
}

function goEdit(item: DemoItem) {
  uni.navigateTo({ url: `/pages/form/index?id=${item.id}` })
}

async function onDelete(item: DemoItem) {
  if (!(await confirmDelete({ content: `确定删除「${item.title}」吗？` })))
    return
  try {
    await deleteDemoItem(item.id)
    markListDirty()
    feedback.success('已删除')
    refresh()
  }
  catch {
    // 错误提示由请求层统一 toast，这里仅终止删除流程
  }
}
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <cm-page :loading="loading && list.length === 0" :error="error" :empty="!loading && list.length === 0" @retry="refresh">
        <wd-button block class="mb-4" @click="goCreate">
          新增条目
        </wd-button>

        <wd-swipe-action
          v-for="item in list"
          :key="item.id"
          class="mb-3 overflow-hidden rounded-card bg-card shadow-card"
        >
          <wd-cell
            :title="item.title"
            label="点击查看详情，左滑编辑 / 删除"
            is-link
            @click="goDetail(item)"
          />
          <template #right>
            <view class="h-full flex items-stretch">
              <wd-button class="h-full w-20 rounded-none" plain @click="goEdit(item)">
                编辑
              </wd-button>
              <wd-button class="h-full w-20 rounded-none" type="danger" @click="onDelete(item)">
                删除
              </wd-button>
            </view>
          </template>
        </wd-swipe-action>

        <view v-if="loading && list.length > 0" class="flex justify-center py-4">
          <wd-loading size="32rpx" />
        </view>
        <view v-else-if="!loading" class="pt-2 text-center">
          <text class="type-caption text-placeholder">
            没有更多了
          </text>
        </view>
      </cm-page>

      <DemoTabBar current="components" />
    </view>
  </DemoTheme>
</template>
