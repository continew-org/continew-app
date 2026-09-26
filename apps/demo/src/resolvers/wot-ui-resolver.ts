import type { ComponentResolver } from '@uni-helper/vite-plugin-uni-components'
import { kebabCase } from '@uni-helper/vite-plugin-uni-components'

/** Wot UI v2 组件自动解析（与官方 starter / 文档一致） */
export function WotResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Wd[A-Z]/)) {
        const compName = kebabCase(name)
        return {
          name,
          from: `@wot-ui/ui/components/${compName}/${compName}.vue`,
        }
      }
    },
  }
}
