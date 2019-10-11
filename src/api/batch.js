import request from '@/util/request'

export function searchByShipName(params) {
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
    url: `/${prefix}/serch/byShip`,
    method: 'get',
    params
  })
}
