<script setup lang="ts">
import type { LoginResult } from '@/api/auth'
import { pickRouteParam, setStoredUser, setTokens } from '@continew-app/core'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { loginByAccount, loginByWechat } from '@/api/auth'
import { feedback } from '@/api/feedback'

const model = reactive({ username: '', password: '' })
const submitting = ref(false)

/** 回跳地址：写接口 401 触发 toLoginPage 时会携带 ?redirect=当前页面 */
const redirect = ref('')

onLoad(() => {
  const raw = pickRouteParam('redirect')
  redirect.value = raw ? decodeURIComponent(raw) : ''
})

async function applyLogin(result: LoginResult) {
  setTokens({ token: result.token, refreshToken: result.refreshToken })
  setStoredUser(result.user)
  feedback.success('登录成功')
  uni.reLaunch({ url: redirect.value || '/pages/home/index' })
}

function toErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback
}

async function onAccountLogin() {
  if (submitting.value)
    return
  if (!model.username.trim() || !model.password.trim()) {
    feedback.error('请输入用户名和密码')
    return
  }
  submitting.value = true
  try {
    await applyLogin(await loginByAccount(model.username.trim(), model.password.trim()))
  }
  catch (err) {
    feedback.error(toErrorMessage(err, '登录失败，请稍后重试'))
  }
  finally {
    submitting.value = false
  }
}

// #ifdef MP-WEIXIN
function onWechatLogin() {
  uni.login({
    provider: 'weixin',
    success: async ({ code }) => {
      if (!code) {
        feedback.error('微信登录失败：未获取到 code')
        return
      }
      try {
        await applyLogin(await loginByWechat(code))
      }
      catch (err) {
        feedback.error(toErrorMessage(err, '微信登录失败，请稍后重试'))
      }
    },
    fail: () => feedback.error('微信登录失败，请检查 appid 配置'),
  })
}
// #endif
</script>

<template>
  <DemoTheme>
    <view class="flex min-h-full flex-col px-6 pb-16 pt-20">
      <view class="flex flex-col items-center">
        <view class="h-16 w-16 flex items-center justify-center rounded-card bg-brand shadow-brand">
          <text class="type-display text-on-brand">
            C
          </text>
        </view>
        <text class="type-page-title mt-5 text-main">
          ContiNew App
        </text>
        <text class="type-body mt-2 text-secondary">
          登录后体验完整 CRUD 演示
        </text>
      </view>

      <view class="mt-10 rounded-card bg-card p-5 shadow-card">
        <wd-input v-model="model.username" placeholder="用户名" clearable />
        <view class="mt-2">
          <wd-input v-model="model.password" placeholder="密码" show-password clearable />
        </view>
        <view class="mt-6">
          <wd-button block :loading="submitting" @click="onAccountLogin">
            登录
          </wd-button>
        </view>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="mt-8 flex items-center">
        <view class="h-px flex-1 bg-divider" />
        <text class="type-caption mx-3 text-placeholder">
          其他登录方式
        </text>
        <view class="h-px flex-1 bg-divider" />
      </view>
      <view class="mt-4">
        <wd-button block plain @click="onWechatLogin">
          微信一键登录
        </wd-button>
      </view>
      <!-- #endif -->

      <view class="mt-10 text-center">
        <text class="type-caption text-placeholder">
          演示账号 admin / 123456 · 接口见 packages/server
        </text>
      </view>
    </view>
  </DemoTheme>
</template>
