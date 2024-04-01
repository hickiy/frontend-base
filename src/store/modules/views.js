const useTagsViewStore = defineStore(
  'views',
  {
    state: () => ({
      breadcrumbs: [], // 面包屑
      cachedViews: [], // 缓存的视图, 用于keep-alive
    })
  })

export default useTagsViewStore
