import http from './http'

//获取验证码
export const getCode = ()=>http("post","/v1/captchas",{});
//账号密码登录
export const login = (options) => http("post","/v2/login",options);
//退出登录
export const logout = (options)=>http("get","/v2/signout",options)
//获取用户信息
export const getUser = (options) => http("get","/v1/user",options);
//重置密码
export const changePwd = (options) => http("post","/v2/changepassword",options);
//上传头像
export const uploadAvatar = (options)=>http("post",`/eus/v1/users/${options.user_id}/avatar`,options.formData);
//获取红包列表详情
export const getHongBaoCount = (options)=>http("get",`/promotion/v2/users/${options.user_id}/hongbaos`,options);
//获取历史红包数据
export const getHistoryHb = (options)=>http("get",`/promotion/v2/users/${options.user_id}/expired_hongbaos`,options);
//根据经纬度获取地址信息
export const getLocationInfo = (options)=>http("get",`v2/pois/40.099301,116.275113,1212`,{})
//获取首页的食品分类标签
export const msiteFoodTypes = (options)=>http("get","/v2/index_entry",{...options,group_type:"1","flags[]":"F"})
//获取餐厅列表
export const getRestaurantList = ({latitude,longitude,offset,restaurant_category_id='',restaurant_category_ids='',order_by='',delivery_mode="",support_ids=[]})=>{
  let supportStr="";
  support_ids.forEach(item=>{
    supportStr+="&support_ids[]="+item
  })
  let _json = {
    latitude,
    longitude,
    offset,
    limit:"20",
    'extras[]': 'activities',
    restaurant_category_id,
    'restaurant_category_ids[]':restaurant_category_ids,
    order_by,
    'delivery_mode[]':delivery_mode+supportStr
  }
  return http("get","/shopping/restaurants",_json)
}
//获取food页面分类列表
export const getFoodCategory = (options)=>http("get","shopping/v2/restaurant/category",options)
//获取配送方式
export const getDelivery = (options)=>http("get","shopping/v1/restaurants/delivery_modes",options)
//获取商家属性
export const getBusinessAttr = (options)=>http("get","shopping/v1/restaurants/activity_attributes",options)
//获取店铺详情
export const getShopDetail = (options)=>http("get",`shopping/restaurant/${options.shopId}`,{
  ...options,
  "extras[]":"activities",
  // "extras[]":"album",
  // "extras[]":"license",
  // "extras[]":"identification",
  // "extras[]":"statistics"
})
//获取店铺评价分数
export const getRateScore = (options)=>http("get",`/ugc/v2/restaurants/${options.shopid}/ratings/scores`)
//获取评价全部分类
export const getRateTags = (options)=>http("get",`/ugc/v2/restaurants/${options.shopid}/ratings/tags`)
//获取评价列表
export const getRateList = (options)=>http("get",`/ugc/v2/restaurants/${options.shopid}/ratings`,options)
//获取店铺商品信息
export const getRestaurantMenu = (options)=>http("get","shopping/v2/menu",options)
//获取店铺的支付信息(支付方式、预计送达时间等)
export const checkOut = (options)=>http("post","/v1/carts/checkout",{
  come_from: "web",
  geohash:options.geohash,
  restaurant_id:options.shopid,
  entities:options.entities || ""
})
//获取地址信息
export const getAddress = ({userId})=>http("get",`/v1/users/${userId}/addresses`)
//搜索接口
export const getShopFromKey = (options)=>http("get","v4/restaurants",{
  "extras[]":"restaurant_activity",
  "type":"search",
  ...options
})