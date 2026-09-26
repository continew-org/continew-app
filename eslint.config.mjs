import { continew } from '@continew-app/eslint-config'

export default continew(
  {
    yaml: false,
    ignores: [
      '**/unpackage',
      '**/dist',
      '**/node_modules',
      '**/*.d.ts',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      'LICENSE',
    ],
  },
  {
    rules: {
      // tsconfig 的键顺序按语义分组，不做字母排序
      'jsonc/sort-keys': 'off',
    },
  },
  {
    // 白名单：红线规则中「合法调用点」集中在 packages/core 的请求层与导航封装内
    files: ['packages/core/src/**'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
  {
    // Node 脚本（tools/）：允许 process / console / 正则（工程化脚本，非业务代码）
    files: ['tools/**/*.mjs'],
    rules: {
      'node/prefer-global/process': 'off',
      'no-console': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-misleading-capturing-group': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
    },
  },
  {
    files: ['apps/demo/**/*.vue'],
    rules: {
      // demo 应用页面允许演示性写法
      'no-alert': 'off',
    },
  },
)
