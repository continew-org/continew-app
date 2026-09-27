<script setup lang="ts">
import { getStoredUser, toLoginPage } from '@continew-app/core'
import { computed, ref } from 'vue'
import { feedback } from '@/api/feedback'

const user = ref(getStoredUser())

// 头像占位：白色圆 + 品牌色首字符，不依赖外部头像图（离线可用）
const avatarText = computed(() => (user.value?.nickname ?? '客').slice(0, 1))

function onLogin() {
  // 去登录页并携带回跳地址，重新登录后回到本页
  toLoginPage()
}

function goSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}

function onAbout() {
  feedback.show('OpenContiNew 社区（演示）')
}
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <view class="relative overflow-hidden rounded-card bg-brand p-6 shadow-brand">
        <!-- 品牌底上的装饰与头像圆用 *-on-brand：亮色下是白、暗色下是深色，两个主题都成立 -->
        <view class="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-on-brand opacity-10" />
        <view class="relative flex items-center">
          <view class="h-14 w-14 flex shrink-0 items-center justify-center rounded-full bg-on-brand">
            <text class="type-page-title text-brand">
              {{ avatarText }}
            </text>
          </view>
          <view class="ml-4">
            <text class="block type-title text-on-brand">
              {{ user?.nickname ?? '未登录用户' }}
            </text>
            <text class="type-caption mt-1 block text-on-brand opacity-80">
              {{ user ? 'ContiNew App 演示账号' : '登录后体验完整 CRUD 演示' }}
            </text>
          </view>
        </view>
      </view>

      <view class="mt-4 overflow-hidden rounded-card bg-card shadow-card">
        <wd-cell-group border>
          <wd-cell v-if="!user" title="去登录" label="账号密码 + 微信一键（会话链路演示）" prefix-icon="lock" is-link @click="onLogin" />
          <wd-cell title="设置" label="会话信息与退出登录" prefix-icon="settings" is-link @click="goSettings" />
          <wd-cell title="关于" label="OpenContiNew 社区" prefix-icon="info-circle" is-link @click="onAbout" />
        </wd-cell-group>
      </view>
    </view>
  </DemoTheme>
</template>
