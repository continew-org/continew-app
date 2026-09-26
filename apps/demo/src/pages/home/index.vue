<script setup lang="ts">
import { confirmDelete } from '@continew-app/core'
import { feedback } from '@/api/feedback'

async function onDemoConfirm() {
  if (await confirmDelete({ content: '这是 confirmDelete 统一删除确认的演示。' })) {
    feedback.success('已确认（演示）')
  }
}
</script>

<template>
  <view class="px-4 pb-8 pt-4">
    <view class="mb-6 pt-8">
      <text class="block text-2xl font-semibold text-main">
        ContiNew App
      </text>
      <text class="mt-2 block text-sm text-secondary">
        面向 vibe coding 的 uni-app 多端工程底座
      </text>
    </view>

    <view class="mb-4">
      <text class="mb-3 block text-sm font-semibold text-main">
        核心机制
      </text>
      <wd-cell-group border>
        <wd-cell title="统一请求层" label="createRequestor：token 注入 + 业务错误归一化 + 401 恢复" icon="link" />
        <wd-cell title="会话管理" label="单飞刷新令牌 + safeBack 兜底返回" icon="lock-on" />
        <wd-cell title="列表三态" label="useList + CmPage：加载 / 错误 / 空态" icon="list" />
      </wd-cell-group>
    </view>

    <view class="mb-4">
      <text class="mb-3 block text-sm font-semibold text-main">
        原子类与组件
      </text>
      <wd-cell-group border>
        <wd-cell title="Tailwind 语法" label="px-4 / text-sm / flex（AI 语料最丰富）" icon="magic" />
        <wd-cell title="wot-* 令牌" label="品牌语义色与间距（对齐 wot-design-uni）" icon="palette" />
        <wd-cell title="Cm* 薄壳" label="CmPage / CmEmpty（基于 wot-design-uni）" icon="view-module" />
      </wd-cell-group>
    </view>

    <view class="mb-4">
      <text class="mb-3 block text-sm font-semibold text-main">
        交互规范
      </text>
      <wd-cell-group border>
        <wd-cell title="统一删除确认" label="confirmDelete：全应用一致的删除交互" icon="delete" is-link @click="onDemoConfirm" />
        <wd-cell title="不裸调 uni API" label="请求 / 返回 / 弹窗走 core 封装（红线机器拦截）" icon="warning" />
      </wd-cell-group>
    </view>

    <DemoTabBar current="home" />
  </view>
</template>
