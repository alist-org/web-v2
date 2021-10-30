/**
 * full
 * 用于月日时分秒小于10补0
 * @param {*} p
 */
 export const full = (p: number) => {
  return p < 10 ? '0' + p : p
}

/**
 * formateDate
 * 将timestamp日期格式化为 yyyy-mm-dd hh-mm-ss
 * @param {*} date
 */
export function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const mon = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()

  return year + '-' + full(mon) + '-' + full(day) + ' ' +
    full(hour) + ':' + full(min) + ':' + full(sec)
}