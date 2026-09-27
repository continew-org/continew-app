<script setup lang="ts">
import { confirmDelete } from '@continew-app/core'
import { feedback } from '@/api/feedback'

async function onDemoConfirm() {
  if (await confirmDelete({ content: '这是 confirmDelete 统一删除确认的演示。' })) {
    feedback.success('已确认（演示）')
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <view class="relative overflow-hidden rounded-card bg-brand p-6 shadow-brand">
        <!-- 品牌底恒为蓝色系，其上的装饰一律用 *-on-brand（亮色下是白、暗色下是深色）。
             不要在这里写死白色类名：那在暗色模式里是硬编码，会被红线扫描拦下。 -->
        <view class="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-on-brand opacity-10" />
        <view class="absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-on-brand opacity-10" />
        <view class="relative">
          <text class="block type-page-title text-on-brand">
            ContiNew App
          </text>
          <text class="type-body mt-2 block text-on-brand opacity-80">
            面向 vibe coding 的多端工程底座，工程治理与 AI 协作是差异化所在
          </text>
          <view class="mt-4 flex">
            <view class="rounded-pill border border-on-brand px-3 py-0.5">
              <text class="type-caption text-on-brand opacity-90">
                uni-app
              </text>
            </view>
            <view class="ml-2 rounded-pill border border-on-brand px-3 py-0.5">
              <text class="type-caption text-on-brand opacity-90">
                Vue 3
              </text>
            </view>
            <view class="ml-2 rounded-pill border border-on-brand px-3 py-0.5">
              <text class="type-caption text-on-brand opacity-90">
                三端一套代码
              </text>
            </view>
          </view>
        </view>
      </view>

      <text class="mb-3 mt-5 block type-title text-main">
        核心机制
      </text>
      <view class="overflow-hidden rounded-card bg-card shadow-card">
        <wd-cell-group border>
          <wd-cell title="统一请求层" label="createRequestor：token 注入 + 业务错误归一化 + 401 恢复" icon="link" />
          <wd-cell title="会话管理" label="单飞刷新令牌 + safeBack 兜底返回" icon="lock-on" />
          <wd-cell title="列表三态" label="useList + CmPage：加载 / 错误 / 空态" icon="list" />
        </wd-cell-group>
      </view>

      <text class="mb-3 mt-5 block type-title text-main">
        原子类与组件
      </text>
      <view class="overflow-hidden rounded-card bg-card shadow-card">
        <wd-cell-group border>
          <wd-cell title="Tailwind 语法" label="px-4 / text-sm / flex（AI 语料最丰富）" icon="magic" />
          <wd-cell title="wot-* 令牌" label="品牌语义色与间距（对齐 wot-design-uni）" icon="palette" />
          <wd-cell title="Cm* 薄壳" label="CmPage / CmEmpty（基于 wot-design-uni）" icon="view-module" />
        </wd-cell-group>
      </view>

      <text class="mb-3 mt-5 block type-title text-main">
        交互规范
      </text>
      <view class="overflow-hidden rounded-card bg-card shadow-card">
        <wd-cell-group border>
          <wd-cell title="统一删除确认" label="confirmDelete：全应用一致的删除交互" icon="delete" is-link @click="onDemoConfirm" />
          <wd-cell title="登录页" label="账号密码 + 微信一键（会话链路演示）" icon="lock-on" is-link @click="goLogin" />
          <wd-cell title="不裸调 uni API" label="请求 / 返回 / 弹窗走 core 封装（红线机器拦截）" icon="warning" />
        </wd-cell-group>
      </view>

      <DemoTabBar current="home" />
    </view>
  </DemoTheme>
</template>
