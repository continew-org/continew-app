<script setup lang="ts">
import { clearSession, getStoredUser } from '@continew-app/core'
import { computed, ref } from 'vue'
import { feedback } from '@/api/feedback'

const user = ref(getStoredUser())

// 头像占位：品牌色圆 + 昵称首字符，不依赖外部头像图（离线可用）
const avatarText = computed(() => (user.value?.nickname ?? '客').slice(0, 1))

function onClearSession() {
  clearSession()
  feedback.success('会话已清除（演示）')
}

function onAbout() {
  feedback.show('OpenContiNew 社区（演示）')
}
</script>

<template>
  <view class="px-4 pb-8 pt-4">
    <view class="mb-6 flex items-center pt-8">
      <view class="h-12 w-12 flex shrink-0 items-center justify-center rounded-full bg-primary">
        <text class="text-lg text-white font-semibold">
          {{ avatarText }}
        </text>
      </view>
      <view class="ml-4">
        <text class="block text-lg font-semibold text-main">
          {{ user?.nickname ?? '未登录用户' }}
        </text>
        <text class="mt-1 block text-xs text-secondary">
          ContiNew App 演示账号
        </text>
      </view>
    </view>

    <wd-cell-group border>
      <wd-cell title="会话管理" label="clearSession 统一登出" icon="lock-on" is-link @click="onClearSession" />
      <wd-cell title="关于" label="OpenContiNew 社区" icon="info-circle" is-link @click="onAbout" />
    </wd-cell-group>

    <DemoTabBar current="profile" />
  </view>
</template>
