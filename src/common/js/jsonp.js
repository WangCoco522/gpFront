// 引入原始jsonp插件
import originJsonp from 'jsonp'
/*
    封装原jsonp插件，返回promise对象
    url： 请求地址
    data：请求的json参数
    option：其他json参数，默认直接写空对象即可
*/
export default function jsonp (url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
    // url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&uin=704838764&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&jsonpCallback=__jp0'
    return new Promise((resolve, reject) => {
    // originJsonp中的参数说明可以到前言中的github中查看
        originJsonp(url, option, (err, data) => {
        if (!err) {
            resolve(data)
        } else {
            reject(err)
        }
        })
    })
}
/*
    封装url参数的拼接
 */
function param (data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        // 防止参数为中文时出现乱码，把字符串作为 URI 组件进行编码
        url += `&${k}=${encodeURIComponent(value)}`
    }
    console.log(url)
    return url ? url.substring(1) : ''
}
