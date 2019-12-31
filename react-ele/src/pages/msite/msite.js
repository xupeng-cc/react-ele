import React, { Component } from 'react'
import BScroll from 'better-scroll'
import {connect} from 'react-redux'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import ShopList from '../shopList/shopList'

import style from './msite.module.scss'

import {getLocationInfo,msiteFoodTypes} from '../../service/apis'
import {Link} from 'react-router-dom'
import * as action from "../../store/action-type"

class Msite extends Component {
  constructor(props){
    super(props);
    this.state = {
      addressName:"首页",
      foodTypes:[],  //分类列表（8个一组）
      typeImgBaseUrl:"https://fuss10.elemecdn.com",  //轮播的图标基础地址
      dottedIndex:0, //轮播的下标
      shopList:[],  //店铺列表
      offset:0,     //店铺列表的偏移
      geohash:"",   //经纬度
      loadMoreFlag:true,  //加载更多的开关
      loaddingFlag:true  //loadding开关
    }
  }
  //获取地址信息
  getLocation = async ()=>{
    let result = await getLocationInfo();
    if(result){
      this.setState({
        addressName:result.name
      })
      this.props.record_address(result)
    }
  }
  //获取食品分类
  getFoodTypes = async ()=>{
    let result = await msiteFoodTypes({geohash:this.state.geohash});
    let _result = [];
    for(let i=0;i<result.length;i+=8){
      _result.push(result.slice(i,i+8));
    }
    this.setState({
      foodTypes:_result
    },()=>{
      this.initFoodSwapper();

      let _wrapperW = this.refs.food_nav_wrapper.clientWidth; 
      let width = 0;
      let children = this.refs.food_nav_contain.children;
      for(let i=0;i<children.length;i++){
        let child = children[i];
        child.style.width = _wrapperW+'px';
        width+=_wrapperW;
      }
      this.refs.food_nav_contain.style.width = width+'px';
    })
  }
  //视频导航轮播
  initFoodSwapper = ()=>{
    const scroll = new BScroll("#food_nav_wrapper",{
      scrollX:true,
      scrollY:false,
      momentum:false,
      snap:{
        loop:true,
        threshold:0.1,
        speed:400
      },
      click:true
    })
    scroll.on("scrollEnd",()=>{
      let {pageX} = scroll.getCurrentPage()
      this.setState({
        dottedIndex:pageX
      })
    })
  }
  
  //获取url中?后面的参数
  getUrlParams(url){
    let params = url.split("?")[1].split("&"),queryObj={}
    params.forEach(item=>{
      let kAv = item.split("=");
      queryObj[kAv[0]] = kAv[1];
    })
    return queryObj;
  }
  componentDidMount(){
    this.setState({
      geohash:this.getUrlParams(this.props.location.search).geohash || ''
    },()=>{
      this.getLocation();
      this.getFoodTypes();
    })
  }
  //获取分类菜单的id
  getRestaurantId = (url)=>{
    let _url = decodeURIComponent(url).split("=")[1].replace("&target_name","");
    if(/restaurant_category_id/ig.test(_url)){
      return JSON.parse(_url).restaurant_category_id.id;
    }else{
      return ""
    }
  }
  render() {
    return (
      <div>
        <Header title={this.state.addressName}/>
        <div className={style.msite_wrapper}>
          <section className={style.food_nav_wrapper} id="food_nav_wrapper" ref="food_nav_wrapper">
            <div className={style.food_nav_contain} ref="food_nav_contain">
              {this.state.foodTypes.map((type,index)=>(
                <div className={style.food_nav_items_box} key={index} ref="food_nav_items_box">
                  <div className={style.food_nav_items}>
                    {type.map((item,i)=>(
                      <div className={style.food_nav_item} key={i}>
                        <Link to={{pathname:"/food",search:"?restaurantId="+this.getRestaurantId(item.link)+"&title="+item.title+"&geohash="+this.state.geohash,query:{}}}>
                          <img className={style.food_nav_icon} src={this.state.typeImgBaseUrl+item.image_url} alt=""/>
                          <div className={style.food_nav_name}>{item.title}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={style.dottedList}>
              {this.state.foodTypes.map((type,index)=>(
                <span className={[style.dotted,this.state.dottedIndex===index?style.active:''].join(" ")} key={index}></span>
              ))}
            </div>
          </section>
          
          

          {/* 商铺列表 */}
          <section className={style.shop_list_wrapper} ref="shopList">
            <header className={style.shop_near}>附近商家</header>
            {this.state.geohash && <ShopList 
            geohash={this.state.geohash} 
            // restaurantId="" 
            // restaurant_category_ids="" 
            // orderBy=""
            ></ShopList>}
          </section>
        </div>
        <Footer url={this.props.match.url}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {}
}
const mapDispatchToProps = (dispatch)=>{
  return {
    record_address:(options)=>dispatch({type:action.RECORD_ADDRESS,payload:options})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Msite);
