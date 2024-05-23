import request from '@/utils/request'
// 导入收款记录
export function importReceipt(data) {
  return request({
    url: '/settlement/payment/importPaymentRecords',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
// 收方开户网点列表
export function getBankList(params) {
  return request({
    url: '/settlement/payment/receiveBankNameList',
    method: 'get',
    params
  })
}
// 收款记录统计
export function getReceiptStatistics(params) {
  return request({
    url: '/settlement/payment/dataInfo',
    method: 'get',
    params
  })
}
// 收款记录列表
export function getReceiptList(params) {
  return request({
    url: '/settlement/payment/list',
    method: 'get',
    params
  })
}
// 删除收款记录
export function deleteReceipt(ids) {
  return request({
    url: `settlement/payment/${ids.join(',')}`,
    method: 'delete',
  })
}

// 查询收款单详情
export function getReceipt(params) {
  return request({
    url: '/settlement/verify/querySettlementVerifyById',
    method: 'get',
    params
  })
}

// 查询核销明细
export function getVerificationDetail(params) {
  return request({
    url: '/settlement/verify/queryVerifyItemById',
    method: 'get',
    params
  })
}
