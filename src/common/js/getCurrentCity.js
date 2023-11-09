// 引入封装好的jsonp
import jsonp from './jsonp.js'
// 假设这里为跨域请求当前城市的接口
export default function getCurrentCity () {
  var user_id = "8n05yvCYxp3d4hGt8QO6p4GwMfame3i6";     //用户名
  var password = "u6Y1PXfVh33jGHq1";    //密码
  var method = "getSIMList";  //接口名-余额查询接口
  var arr = new Array();//加密数组，数组所需参数根据对应的接口文档
  var pageIndex = 1
  arr.push(user_id);
  arr.push(password);
  arr.push(method);
   //key值指密钥，由电信提供，每个客户都有对应的key值，key值平均分为三段如下：
  var key1 = "gea";
  var key2 = "3pt";
  var key3 = "QCS";
  var passWord =strEnc(password,key1,key2,key3);  //密码加密 
  //密码加密结果：441894168BD86A2CC
  //调用des.js文件中的数组自然排序方法：
  var arrOrder=naturalOrdering(arr);
  var sign = strEnc(arrOrder,key1,key2,key3); //生成sign加密值
  // 接口地址
  let url = 'http://api.ct10649.com:9001/m2m_ec/query.do?format=json'
  // 所需参数
  let datas = {
    'method':method,
    'pageIndex': pageIndex,
    'access_number':'',
    'ecportalAccount': '',
    'activationTimeBegin': '',
    'activationTimeEnd': '',
    'simStatus': '',
    'groupId': '',
    'iccid':'',
    'custId':'',
    'user_id':user_id,
    'passWord': passWord,
    'sign': sign
  }
  console.log(url)
  return jsonp(url, datas, {})
}
