//图片的地址前缀
export const imgBaseUrl = "http://elm.cangdu.org/img/";
//存储
export const setStore = (key, val) => {
  window.localStorage.setItem(key, JSON.stringify(val))
}
//取值
export const getStore = (key) => {
  return JSON.parse(window.localStorage.getItem(key))
}
//删除值
export const removeStore = (key) => {
  window.localStorage.removeItem(key);
}
//解析url中的参数  （?之后的参数）
export const getUrlParams = (paramstr) => {
  let params = {};
  let paramsList = decodeURIComponent(paramstr).split("?")[1].split("&");
  paramsList.forEach((item) => {
    let _item = item.split("=");
    params[_item[0]] = _item[1]
  })
  return params;
}
//有些图片需要解析才能展示
export const getImgPath = (path) => {
  let suffix;
  if (!path) {
    return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
  }
  if (path.indexOf('jpeg') !== -1) {
    suffix = '.jpeg'
  } else {
    suffix = '.png'
  }
  let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
  return 'https://fuss10.elemecdn.com' + url
}