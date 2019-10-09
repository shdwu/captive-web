import request from '@/util/request'

// 这里做一个加分页
export function getOrderList() {
  let nameType = localStorage.getItem('nametype')
  let prefix = ''
  if (nameType === 'BROKER') {
    prefix = 'broker'
  } else if (nameType === 'SHIPOWNER') {
    prefix = 'shiper'
  } else {
    prefix = 'captive'
  }
  return request({
    url: `/${prefix}/curOrders`,
    method: 'get'
  })
}
