<script setup lang="ts">
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import { pickRouteParam, safeBack } from '@continew-app/core'
import { onLoad } from '@dcloudio/uni-app'
import { zodAdapter } from '@wot-ui/ui'
import { computed, reactive, ref } from 'vue'
import { z } from 'zod/v4'
import { createDemoItem, fetchDemoItem, markListDirty, updateDemoItem } from '@/api/demo'
import { feedback } from '@/api/feedback'

const formRef = ref<FormInstance>()
const model = reactive({ title: '', summary: '' })

/**
 * 与服务端 itemPayloadSchema 保持一致（packages/server/src/routes/demo.ts）。
 * 用 zod/v4：wd-form 的 zodAdapter 按 v4 的 safeParse(model, { jitless }) 形状设计。
 */
const schema = zodAdapter(z.object({
  title: z.string().trim().min(1, '请输入标题').max(50, '标题不能超过 50 字'),
  summary: z.string().trim().max(200, '摘要不能超过 200 字'),
}))

const itemId = ref<number | null>(null)
const loading = ref(false)
const loadError = ref<string | null>(null)
const submitting = ref(false)

const isEdit = computed(() => itemId.value !== null)

async function loadItem(id: number) {
  loading.value = true
  loadError.value = null
  try {
    const item = await fetchDemoItem(id)
    model.title = item.title
    model.summary = item.summary
  }
  catch (err) {
    loadError.value = err instanceof Error ? err.message : '加载失败'
  }
  finally {
    loading.value = false
  }
}

onLoad(() => {
  const id = Number(pickRouteParam('id'))
  if (!id) {
    uni.setNavigationBarTitle({ title: '新建条目' })
    return
  }
  itemId.value = id
  uni.setNavigationBarTitle({ title: '编辑条目' })
  loadItem(id)
})

function onRetry() {
  if (itemId.value !== null)
    loadItem(itemId.value)
}

async function onSubmit() {
  if (submitting.value)
    return
  const { valid } = await formRef.value?.validate() ?? { valid: false }
  if (!valid)
    return
  submitting.value = true
  try {
    const payload = { title: model.title, summary: model.summary }
    if (isEdit.value) {
      await updateDemoItem(itemId.value!, payload)
    }
    else {
      await createDemoItem(payload)
    }
    markListDirty()
    feedback.success(isEdit.value ? '已保存' : '已创建')
    safeBack('/pages/components/index')
  }
  catch {
    // 错误提示由请求层统一 toast，这里仅终止提交流程
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <DemoTheme>
    <view class="px-4 pb-8 pt-4">
      <cm-page :loading="loading" :error="loadError" :empty="false" @retry="onRetry">
        <view class="overflow-hidden rounded-card bg-card shadow-card">
          <wd-form ref="formRef" :model="model" :schema="schema">
            <wd-cell-group border>
              <wd-form-item label="标题" prop="title" required>
                <wd-input v-model="model.title" placeholder="请输入标题" clearable />
              </wd-form-item>
              <wd-form-item label="摘要" prop="summary">
                <wd-textarea v-model="model.summary" placeholder="请输入摘要（选填）" clearable />
              </wd-form-item>
            </wd-cell-group>
          </wd-form>
        </view>

        <view class="mt-6">
          <wd-button block :loading="submitting" @click="onSubmit">
            {{ isEdit ? '保存' : '创建' }}
          </wd-button>
        </view>
        <view class="mt-3 text-center">
          <text class="type-caption text-placeholder">
            校验规则与 packages/server 的 itemPayloadSchema 保持一致
          </text>
        </view>
      </cm-page>
    </view>
  </DemoTheme>
</template>
