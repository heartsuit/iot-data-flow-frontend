/** 这样导出会在import时：import { formatTime } from "../utils/util";
 *  报错："export 'formatTime' was not found in '../utils/util'
 */
// export default {
//   formatTime: function (date) {
//     let year = date.getFullYear()
//     let month = date.getMonth() + 1
//     let day = date.getDate()

//     let hour = date.getHours()
//     let minute = date.getMinutes()
//     let second = date.getSeconds()

//     return [year, month, day].map(formatNumber).join('-')
//   }
// }

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  // let hour = date.getHours()
  // let minute = date.getMinutes()
  // let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}