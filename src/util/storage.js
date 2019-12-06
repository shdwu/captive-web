
var storage = {
  clickLine(data){
    if (data) {
      let mmsi = data.mmsi;
      if (data.orderDtos && data.orderDtos.length != 0) {
        let start = data.orderDtos[0].intime.replace(/-/g, '/'); //将时间字符串转成格式2019/11/11 20:11:11兼容ios
        let end = data.orderDtos[data.orderDtos.length - 1].outtime.replace(/-/g, '/');
        start = start.substring(0, 10) + ' 00:00'
        end = end.substring(0, 10) + ' 23:59'
        start = new Date(start).getTime()
        end = new Date(end).getTime()
        //  打开新的页面并跳转到该地址
        window.open('http://10.18.121.90:8090/#/?mmsi=' + mmsi + '&start=' + start + '&end=' + end)
      }
    }
  }

}
export default storage;
