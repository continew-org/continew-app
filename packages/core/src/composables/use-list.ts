import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'

export interface UseListOptions<T, Q = Record<string, unknown>> {
  /** 拉取一页数据；page 从 1 开始 */
  fetcher: (page: number, size: number, query: Q) => Promise<T[]>
  /** 每页条数，默认 20 */
  size?: number
  /** 查询条件（可选 ref；传入后会深度 watch，变化时自动 refresh） */
  query?: Ref<Q>
  /** 挂载时自动加载第一页，默认 true */
  immediate?: boolean
}

/** 列表三态 + 分页：加载中 / 错误 / 空态 缺一不可（AGENTS.md 红线） */
export function useList<T, Q = Record<string, unknown>>(options: UseListOptions<T, Q>) {
  const { fetcher, size = 20, query, immediate = true } = options

  const list = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const finished = ref(false)
  const error = ref<string | null>(null)
  const page = ref(0)

  async function loadMore() {
    if (loading.value || finished.value)
      return
    loading.value = true
    error.value = null
    try {
      const next = page.value + 1
      const items = await fetcher(next, size, query?.value as Q)
      list.value = next === 1 ? items : [...list.value, ...items]
      page.value = next
      finished.value = items.length < size
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
    }
    finally {
      loading.value = false
    }
  }

  async function refresh() {
    page.value = 0
    finished.value = false
    await loadMore()
  }

  if (query) {
    watch(query, refresh, { deep: true })
  }

  if (immediate) {
    onMounted(refresh)
  }

  return { list, loading, finished, error, page, loadMore, refresh }
}
