import * as user from './action-type'

let defaultState = {
  userInfo:{},   //用户信息
  latAndLong:{}, //经纬度
  shopDetailInfo:{},  //当前店铺信息
  cartList:{},        //加入购物车的商品列表
  addressList:[],      //地址列表
  chooseAddress:null,   //选择的配送地址
  historySearch:[]     //历史搜索记录
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
  }else if(type===user.ADD_CART){
    // {"1":{"1-1":{"1-1-1":{"name":"","price":"","num":""},"1-1-2":{}}}}
    let {shopid,category_id,foodid,name,price} = payload;
    let cart = state.cartList;
    let shop = cart[shopid] = (cart[shopid] || {});    // cart {"1":{}}    shop  {}
    let category = shop[category_id] = shop[category_id] || {};  // shop {"1-1":{}}  
    let food = category[foodid] = category[foodid]||{};          //category  {"1-1-1":{}}
    if(food.num){
      food.num+=1;
    }else{
      food.name=name;
      food.price=price;
      food.num=1;
      food.quantity = 1;
      food.item_id=foodid;
      food.specs = ["默认值"];
      food.packing_fee=0;
      food.sku_id=23631;
      food.stock=1000;
      food.attrs=[];
      food.extra={};
    }
    setStore("cartList",cart)
    return {...state,cartList:cart}
  }else if(type===user.REDUCE_CART){
    let {shopid,category_id,foodid} = payload;
    let cart = state.cartList;
    if(cart[shopid] && cart[shopid][category_id] && cart[shopid][category_id][foodid]){
      let food = cart[shopid][category_id][foodid];
      if(food.num>1){
        food.num--;
      }else{
        delete cart[shopid][category_id][foodid];
      }
    }
    setStore("cartList",cart);
    return {...state,cartList:cart};
  }else if(type===user.EMPTY_CART){
    let {shopid} = payload;
    let cart = state.cartList;
    cart[shopid] = {};
    setStore("cartList",cart);
    return {...state,cartList:cart};
  }else if(type===user.SET_ADDRESS){
    return {...state,addressList:payload.addressList,chooseAddress:state.chooseAddress || payload.addressList[0]};
  }else if(type===user.CHOOSE_ADDRESS){
    return {...state,chooseAddress:payload.chooseAddress}
  }else if(type===user.SAVE_HISTORY_SEARCH){
    let historySearch = state.historySearch;
    let keyword = payload.keyword;
    if(historySearch.indexOf(keyword)<0){
      historySearch.push(keyword);
    }
    setStore("historySearch",historySearch)
    return {...state,historySearch}
  }else if(type===user.DELETE_HISTORY_SEARCH){
    let historySearch = JSON.parse(JSON.stringify(state.historySearch));
    let keyword = payload.keyword;
    let index = historySearch.findIndex(h=>h===keyword);
    historySearch.splice(index,1);
    setStore("historySearch",historySearch)
    console.log({...state,historySearch})
    return {...state,historySearch}
  }else if(type===user.EMPTY_HISTORY_SEARCH){
    setStore("historySearch",[])
    return {...state,historySearch:[]}
  }else{
    return state;
  }
}

