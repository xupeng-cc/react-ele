import * as user from './action-type'

let defaultState = {
  userInfo:{},   //用户信息
  latAndLong:{}, //经纬度
  shopDetailInfo:{},  //当前店铺信息
}
const StatePackage = (state)=>{
  Object.keys(state).map((key)=>{
    if( Object.prototype.toString.call(state[key]) ==="[object Object]" ){
      if(sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key))){
        return state[key] = JSON.parse(sessionStorage.getItem(key));
      }
      return state[key] = {}
    }else if( Object.prototype.toString.call(state[key]) ==="[object Array]" ){
      if(sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key))){
        return state[key] = JSON.parse(sessionStorage.getItem(key));
      }
      return state[key] = []
    }else{
      if(sessionStorage.getItem(key)){
        return state[key] = sessionStorage.getItem(key)
      }
      return state[key] = ""
    }
  })
  return state;
}
const setStore = (key,val)=>{
  sessionStorage.setItem(key,JSON.stringify(val))
}

export default (state=StatePackage(defaultState),action) => {
  let {type,payload} = action;
  if(type===user.SAVE_USERINFO){
    setStore("userInfo",payload)
    return {...state,userInfo:payload};
  }else if(type===user.LOGOUT){
    setStore("userInfo",payload)
    return {...state,userInfo:{}};
  }else if(type===user.RECORD_ADDRESS){
    setStore("latAndLong",payload)
    return {...state,latAndLong:payload};
  }else if(type===user.RECORD_SHOP_DETAIL){
    setStore("shopDetailInfo",payload);
    return {...state,shopDetailInfo:payload}
  }else{
    return state;
  }
}

