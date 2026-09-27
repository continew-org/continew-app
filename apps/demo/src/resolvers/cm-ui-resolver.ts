import type { ComponentResolver } from '@uni-helper/vite-plugin-uni-components'
import { kebabCase } from '@uni-helper/vite-plugin-uni-components'

/**
 * Cm* 薄壳组件解析（@continew-app/ui），与 WotResolver 同机制。
 * Cm* 位于 workspace 包且路径带 src/ 前缀，easycom autoscan 覆盖不到，必须显式 resolve；
 * 漏配的后果是 <cm-page> 以裸元素渲染（props 全部变成 HTML attribute），三态机制静默失效。
 */
export function CmResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Cm[A-Z]/)) {
        // 目录为 kebab（cm-page/），文件为 Pascal（CmPage.vue）——两者不一致，
        // 且 Windows 上包内子路径解析不折叠大小写，文件名必须用原始 PascalCase
        const compName = kebabCase(name)
        return {
          name: 'default',
          from: `@continew-app/ui/src/components/${compName}/${name}.vue`,
        }
      }
    },
  }
}
