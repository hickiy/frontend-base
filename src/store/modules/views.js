import { useSessionStorage } from '@vueuse/core'
const useTagsViewStore = defineStore(
  'views',
  {
    state: () => ({
      breadcrumbs: useSessionStorage('smt-sys-pc_breadcrumbs', []), // 面包屑
      cachedViews: [], // 缓存的视图, 用于keep-alive
    }),
  })

export default useTagsViewStore
