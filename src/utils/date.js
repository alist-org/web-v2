/**
 * formateDate
 * 将timestamp日期格式化为 yyyy-mm-dd hh-mm-ss
 * @param {*} date
 */
export function formatDate(date) {
    date = new Date(date)
    let year = date.getFullYear()
    let mon = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
  
    return year + '-' + full(mon) + '-' + full(day) + ' ' +
            full(hour) + ':' + full(min) + ':' + full(sec)
  }
  
  /**
   * full
   * 用于月日时分秒小于10补0
   * @param {*} p
   */
  export function full(p) {
    return p < 10 ? '0' + p : p
  }
  