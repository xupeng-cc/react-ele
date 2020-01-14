import React, { Component } from 'react'
import style from './shopList.module.scss'
import {fromJS,is} from 'immutable'
import {imgBaseUrl} from '../../config/utils'
import Star from '../../components/star/star'
import Load from '../../components/loading/loading'
import {getRestaurantList} from '../../service/apis'
import {Link} from 'react-router-dom'

class ShopList extends Component {
  constructor(props){
    super(props);
    this.state = {
      oldProps:{},  //保存上一次父组件传递的参数，用来做比较
      offset:0,
      shopList:[],
      loaddingFlag:true,
      loadMoreFlag:true
    }
  }
  getShopList = async ()=>{
    let {geohash,restaurantId="",restaurant_category_ids="",orderBy="",delivery_mode="",support_ids=[]} = this.props;
    let locationObj = geohash.split(",");
    let latitude = locationObj[0],longitude = locationObj[1];
    let result = await getRestaurantList({
      latitude,
      longitude,
      restaurant_category_id:restaurantId,
      restaurant_category_ids,
      offset:this.state.offset,
      order_by:orderBy,
      support_ids,
      delivery_mode
    })
    this.setState({
      shopList:[...this.state.shopList,...result],
      offset:this.state.offset+=20,
      loaddingFlag:false,
      loadMoreFlag:true,
      oldProps:this.props
    })
  }
  //判断到达页面底部
  loadMore=()=>{
    let top = document.documentElement.scrollTop || document.body.scrollTop,
        clientHeight = document.documentElement.clientHeight,
        height = document.documentElement.scrollHeight;
    if(top+clientHeight>=height){  //到达页面底部
        if(this.state.loadMoreFlag){
          this.setState({
            loadMoreFlag:false,
            loaddingFlag:true
          },()=>{
            this.getShopList(); 
          });
        }
    }
  }
  //防抖
  debounce=(fun,wait)=>{
    let timeout = null;
    return ()=>{
        if(timeout !== null) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(fun, wait);  
    }
  }
  componentDidMount(){
    this.getShopList();
    //监听页面滚动
    window.addEventListener("scroll",this.debounce(this.loadMore,500))
  }
  static getDerivedStateFromProps(nextProps,state){
    //判断props是否发生变化，变化后更新state
    if( !is(fromJS(nextProps),fromJS(state.oldProps)) ){
      return {...state,oldProps:nextProps,offset:0,shopList:[],loaddingFlag:true}
    }
    return null
  }
  shouldComponentUpdate(nextProps,nextState){
    // return true
    return !is( fromJS(nextState),fromJS(this.state) )
  }
  render() {
    return (
      <section style={{backgroundColor:"#fff"}}>
        {this.state.shopList.map((item)=>(
          <Link to={"/shop/"+item.id} key={item.id}>
            <ShopItem shopInfo={item}></ShopItem>
          </Link>
        ))}

        {this.state.loaddingFlag && <Load></Load>}
      </section>
    )
  }
  getSnapshotBeforeUpdate(prevProps,prevState){
    //判断props是否发生变化，有变化重新请求数据
    if(!is(fromJS(prevProps),fromJS(this.props))){
      this.getShopList();
    }
    return null;
  }
  componentDidUpdate(){
    
  }
  componentWillUnmount(){
    window.removeEventListener("scroll",this.debounce(this.loadMore,500));
  }
}

function ShopItem({shopInfo}){
  return (
    <div className={style.shop_item}>
      <div className={style.shop_item_left}>
        <img className={style.shop_img} src={imgBaseUrl+shopInfo.image_path} alt=""/>
        <div className={style.shop_des}>
          <p className={style.shop_title}>
            <b className={style.shop_brand}>品牌</b>
            <b className={style.shop_name}>
              {shopInfo.name}
            </b>
          </p>
          <div className={style.shop_score}>
            <div className={style.shop_star}>
              <Star rate={shopInfo.rating}></Star>
            </div>
            <span className={style.shop_fraction}>{shopInfo.rating}</span>
            <span className={style.shop_sale_volume}>月售{shopInfo.recent_order_num}单</span>
          </div>
          <p className={style.shop_other}>
            <span className={style.shop_minu_bar}>￥{shopInfo.float_minimum_order_amount}起送</span>
            <span>/</span>
            <span className={style.shop_fee}>配送费约{shopInfo.float_delivery_fee}元</span>
          </p>
        </div>
      </div>
      <div className={style.shop_item_right}>
        <p className={style.shop_standard}>
          {shopInfo.supports && shopInfo.supports.map(support=>(
            <span key={support._id} className={style.shop_juti}>{support.icon_name}</span>
          ))}
          <span className={style.shop_juti}>保</span>
        </p>
        <p className={style.shop_matching}>
          {shopInfo.delivery_mode && <span className={style.shop_zhuan}>{shopInfo.delivery_mode.text}</span>}
          <span className={style.shop_zhui}>准时达</span>
        </p>
        <p className={style.shop_time_distance}>
          <span className={style.shop_distance}>{shopInfo.distance}</span>
          <span>/</span>
          <span className={style.shop_time}>{shopInfo.order_lead_time}</span>
        </p>
      </div>
    </div>
  )
}

export default ShopList;