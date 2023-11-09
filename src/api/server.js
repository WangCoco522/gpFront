import axios from "axios";
//创建一个axios实例
const serve = axios.create();

serve.interceptors.response.use(resp => {
  if (resp.data.code !== 0) {
    Message({
      message: resp.data.msg,
      type: 'error',
    });
  }
  return resp
},
  error => {
    return Promise.reject(error)
  }
)
export default serve