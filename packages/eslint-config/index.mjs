import antfu from '@antfu/eslint-config'

/**
 * ContiNew App 统一 ESLint 配置。
 *
 * 基于 @antfu/eslint-config 二次定制：
 * - 面向 uni-app + Vue3 + TS 的 monorepo
 * - 关闭与 uni-app 条件编译、rpx 单位等约定冲突的规则
 * - 内置「代码红线」规则（no-restricted-*），把 AGENTS.md 中 ESLint 可覆盖的约束机器化
 */
export function continew(options = {}, ...userConfigs) {
  return antfu(
    {
      vue: true,
      typescript: true,
      formatters: false,
      ...options,
    },
    {
      rules: {
        // uni-app 页面/组件按目录组织（pages/xxx/index.vue），不要求多词组件名
        'vue/multi-word-component-names': 'off',
        // 允许非空断言（uni-app 平台 API 边界处常见，由 typecheck 兜底）
        '@typescript-eslint/no-non-null-assertion': 'off',
        // 允许 console.warn / console.error，禁止 console.log（生产构建会统一 drop）
        'no-console': ['warn', { allow: ['warn', 'error'] }],

        // ── 代码红线（与 AGENTS.md 红线章节一一对应，白名单见各规则 message）──

        // 红线 2/3：不裸调 uni.navigateBack / uni.showModal
        'no-restricted-properties': [
          'error',
          {
            object: 'uni',
            property: 'navigateBack',
            message: '请使用 @continew-app/core 的 safeBack() 兜底返回（H5 刷新 delta=0 时 uni.navigateBack 会失效）',
          },
          {
            object: 'uni',
            property: 'showModal',
            message: '删除/确认操作请使用 @continew-app/core 的 confirmDelete()，保证全应用交互一致',
          },
          {
            object: 'uni',
            property: 'showToast',
            message: '提示反馈请使用 createGlobalFeedback() 创建的实例（见 apps/demo/src/api/feedback.ts），保证交互一致且可平滑替换实现',
          },
          {
            object: 'uni',
            property: 'showLoading',
            message: '加载提示请使用 createGlobalFeedback() 实例的 loading()/hide()，统一防抖与遮罩',
          },
          {
            object: 'uni',
            property: 'hideToast',
            message: '请使用 createGlobalFeedback() 实例的 hide() 统一关闭反馈',
          },
          {
            object: 'uni',
            property: 'hideLoading',
            message: '请使用 createGlobalFeedback() 实例的 hide() 统一关闭反馈',
          },
        ],

        // 红线 6：不写 :deep() 穿透 wd-* 内部样式
        'vue/no-restricted-block': [
          'error',
          {
            element: 'style',
            message: '样式请优先使用原子类（Tailwind 语法）与 wot-* 令牌类，避免 scoped 样式块与 :deep() 穿透',
          },
        ],
        'vue/no-restricted-v-bind': [
          'error',
          {
            argument: '/^deep/',
            message: '禁止使用 :deep() 穿透 wd-* 组件内部样式；确有需要请提 Issue 到组件库或扩展 Cm* 薄壳',
          },
        ],

        // 红线 8：业务计算不写在组件内（限制 SFC 行数，强制拆分）
        'vue/max-lines-per-block': [
          'error',
          {
            template: 300,
            script: 300,
            style: 50,
            skipBlankLines: true,
          },
        ],

        ...(options.rules ?? {}),
      },
    },
    ...userConfigs,
  )
}

export default continew
