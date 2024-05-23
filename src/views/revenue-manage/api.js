import request from '@/utils/request'
// 查询项目列表
export function getProjectList(params) {
  return request({
    url: '/batteryRental/comBiz/queryProjectList',
    method: 'get',
    params
  })
}

// 查询营收单合约主体客户列表
export function getContractCustomerList(params) {
  return request({
    url: '/settlement/revenue/revenueCustomerList',
    method: 'get',
    params
  })
}

// 查询营收单列表
export function getRevenueList(params) {
  return request({
    url: '/settlement/revenue/voList',
    method: 'get',
    params
  })
}

// 查询营收汇总列表
export function getRevenueSummaryList(params) {
  return request({
    url: '/settlement/revenue/stat',
    method: 'get',
    params
  })
}

// 查询营收单详情
export function getRevenueDetail(params) {
  return request({
    url: '/settlement/revenue/detail',
    method: 'get',
    params
  })
}

// 查询营收单营收明细列表
export function getRevenueDetailList(params) {
  return request({
    url: '/settlement/revenue/billList',
    method: 'get',
    params
  })
}
