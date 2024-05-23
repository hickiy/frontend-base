export default [
  {
    path: '/revenue-manage/detail',
    props: (route) => route.query,
    component: () => import('@/views/revenue-manage/detail.vue'),
    meta: { title: '营收单详情' }
  },
  {
    path: '/revenue-manage/check-detail',
    props: (route) => route.query,
    component: () => import('@/views/revenue-manage/check-detail.vue'),
    meta: { title: '账单详情' }
  },
  {
    path: '/receipt-manage/verify',
    props: (route) => route.query,
    component: () => import('@/views/receipt-manage/verify/index.vue'),
    meta: { title: '收款认领/核销' }
  },
  {
    path: '/receipt-manage/detail',
    props: (route) => route.query,
    component: () => import('@/views/receipt-manage/detail.vue'),
    meta: { title: '核销明细' }
  }
]
