import axios from 'axios';
axios.defaults.baseURL = "";
axios.defaults.timeout = "30000";

axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    console.log("请求超时");
    return Promise.reject(err);
  }
)

axios.interceptors.response.use(
  data => {
    return data;
  },
  error => {
    switch (error.response.status){
      case 400:
        console.log("错误请求");
        break;
      case 401:
        console.log("未授权，请重新登录");
        break;
      case 403:
        console.log("拒绝访问");
        break;
      case 404:
        console.log("请求错误，为找到改资源");
        break;
      case 405:
        console.log("请求方法未允许");
        break;
      case 408:
        console.log("请求超时");
        break;
      case 500:
        console.log("服务端出错");
        break;
      case 501:
        console.log("网络未实现");
        break;
      case 502:
        console.log("网络错误");
        break;
      case 503:
        console.log("服务不可用");
        break;
      case 504:
        console.log("网络超时");
        break;
      case 505:
        console.log("http版本不支持该请求");
        break;
      default:
        console.log(`连接错误${error.response.status}`);
    }
    return Promise.reject(error.response)
  }
)

function httpRequest(method,url,data){
  return new Promise((resolve,reject)=>{
    axios({
      method,
      url,
      data,
      params: method ==='get'?data:{}
    }).then(res=>{
      res && resolve(res.data)
    }).catch(error=>{
      reject(error)
    })
  })
}

export default httpRequest;
