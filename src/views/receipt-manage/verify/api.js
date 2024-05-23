import request from '@/utils/request'

// 查询收款单详情
export function getReceipt(params) {
  return request({
    url: '/settlement/verify/querySettlementVerifyById',
    method: 'get',
    params
  })
}

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
    url: '/settlement/revenueItem/unPayedList',
    method: 'get',
    params
  })
}

// 查询退款单客户列表
export function getRefundCustomerList(params) {
  return request({
    url: '/settlement/refund/refundCustomerList',
    method: 'get',
    params
  })
}

// 查询退款单列表
export function getRefundList(params) {
  return request({
    url: '/settlement/refund/unRefundList',
    method: 'get',
    params
  })
}

// 提交收款核销
export function submitVerify(data) {
  return request({
    url: '/settlement/verify/submitVerifyVo',
    method: 'post',
    data
  })
}


