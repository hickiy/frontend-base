import request from '@/utils/request'

// 获取项目列表
export function getProjectList(params) {
  return request({
    url: '/batteryRental/comBiz/queryProjectList',
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
    url: '/settlement/refund/voList',
    method: 'get',
    params
  })
}

// 退款提交
export function refundSubmit(data) {
  return request({
    url: '/settlement/refund/submitRefund',
    method: 'post',
    data
  })
}

// 查询退款明细
export function getRefundDetail(params) {
  return request({
    url: '/settlement/refund/itemVoList',
    method: 'get',
    params
  })
}
