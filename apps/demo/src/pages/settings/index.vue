<script setup lang="ts">
import { clearSession, getStoredUser, toLoginPage } from '@continew-app/core'
import { computed, ref } from 'vue'
import { feedback } from '@/api/feedback'

const user = ref(getStoredUser())

// 头像占位：品牌色圆 + 昵称首字符，不依赖外部头像图（离线可用）
const avatarText = computed(() => (user.value?.nickname ?? '客').slice(0, 1))

function onLogout() {
  clearSession()
  feedback.success('已退出登录')
  // 去登录页并携带回跳地址，重新登录后回到本页
  toLoginPage()
}
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <view class="rounded-card bg-card p-5 shadow-card">
        <view class="flex items-center">
          <view class="h-12 w-12 flex shrink-0 items-center justify-center rounded-full bg-brand">
            <text class="type-title text-on-brand">
              {{ avatarText }}
            </text>
          </view>
          <view class="ml-4">
            <text class="block type-title text-main">
              {{ user?.nickname ?? '未登录用户' }}
            </text>
            <text class="type-caption mt-1 block text-secondary">
              ContiNew App 演示账号
            </text>
          </view>
        </view>
      </view>

      <view class="mt-4 overflow-hidden rounded-card bg-card shadow-card">
        <wd-cell-group border>
          <wd-cell title="当前账号" :value="user?.nickname ?? '未登录'" />
          <wd-cell title="关于" label="OpenContiNew 社区" icon="info-circle" is-link @click="feedback.show('OpenContiNew 社区（演示）')" />
        </wd-cell-group>
      </view>

      <view class="mt-6">
        <wd-button block type="danger" plain @click="onLogout">
          退出登录
        </wd-button>
      </view>
    </view>
  </DemoTheme>
</template>
