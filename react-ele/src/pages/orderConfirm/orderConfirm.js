import React, { Component } from 'react'
import Header from "../../components/header/header"
import style from './orderConfirm.module.scss'
import Icon from '../../components/incon/icon'
import {getUrlParams} from '../../config/utils'
import {connect} from 'react-redux'
import {checkOut} from '../../service/apis'
import ChooseAddress from './children/chooseAddress'
import {Route,Link} from 'react-router-dom'

const testImgPath = "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750";
class OrderConfirm extends Component {
  constructor(props){
    super(props);
    this.state={
      shopCart:null
    }
  }
  goBack(){
    this.props.history.goBack();
  }
  async checkOutInfo({shopid,geohash,entities}){
    let result = await checkOut({shopid,geohash,entities})
    // getAddress({userId:40945})
  }
  calcTotalPrice(){
    let totalPrice = 6;  //初始值餐盒费+配送费
    let { shopCart } = this.state;
    for(let key in shopCart){
      let cate = shopCart[key];
      for(let cateKey in cate){
        totalPrice+=(cate[cateKey]["num"]*cate[cateKey]["price"])
      }
    }
    return totalPrice;
  }
  render() {
    let {shopCart} = this.state;
    let {chooseAddress} = this.props;
    return (
      <div className={style.orderConfirm}>
        <Header title="确认订单" goBack={()=>this.goBack()}></Header>
        <Link to={`${this.props.match.url}/chooseAddress`}>
          <div className={style.address_contailer}>
            <Icon iconName="location" fill="#3190e8" iconStyle={{width:"0.8rem",height:"0.8rem"}}></Icon>
            <div className={style.addressText}>
              <p>
                <b>{chooseAddress.name}</b> <span>{chooseAddress.sex==1?"男":"女"}</span> <span>{chooseAddress.phone}</span>
              </p>
              <p>
                <b>{chooseAddress.tag}</b> <span>{chooseAddress.address_detail}</span>
              </p>
            </div>
            <Icon iconName="right"></Icon>
          </div>
        </Link>
        <div className={style.deliver_time}>
          <p className={style.deliver_text}>送达时间</p>
          <div className={style.deliver_right}>
            <p>尽快送达 | 预计20:20</p>
            <p>蜂鸟专送</p>
          </div>
        </div>
        <div className={style.payMethod}>
          <p>
            <span>支付方式</span>
            <span>在线支付</span>
          </p>
          <p>
            <span>红包</span>
            <span>暂时只有在渴了吗APP中支持</span>
          </p>
        </div>
        <div className={style.goodList}>
          <div className={style.goodTitle}>
            <img src={testImgPath} alt="店铺头像"/>
            <span>店铺名字</span>
          </div>
          <ul className={style.goodList_ul}>
            {shopCart && Object.keys(shopCart).map(category=>(
              Object.keys(shopCart[category]).map(food=>{
                let current = shopCart[category][food];
                return (
                  <li className={style.goodList_li} key={current.item_id}>
                    <span>{current.name}</span>
                    <div>
                      <span className={style.goodNum}>X{current.num}</span>
                      <span>￥{current.price * current.num}</span>
                    </div>
                  </li>
                )
              })
            ))}
          </ul>
          <div className={style.otherCost}>
            <span>餐盒</span>
            <span>￥1</span>
          </div>
          <div className={style.otherCost}>
            <span>配送费</span>
            <span>￥5</span>
          </div>
          <div className={style.totalPrice}>
            <span>总计</span>
            <span>￥{this.calcTotalPrice().toFixed(2)}</span>
          </div>
        </div>
        <div className={style.remark}>
          <p>
            <span>订单备注</span>
            <span>口味、偏好等</span>
          </p>
          <p>
            <span>发票抬头</span>
            <span>不需要开发票</span>
          </p>
        </div>
        <footer className={style.confirmFoot}>
          <span>待支付￥121</span>
          <span>确认下单</span>
        </footer>

        <Route path={this.props.match.url+"/chooseAddress"} component={ChooseAddress}></Route>
      </div>
    )
  }
  componentDidMount(){
    console.log(this.props)
    let params = getUrlParams(this.props.location.search)
    console.log(params)
    if(params.shopid){
      let cart = this.props.cartList[params.shopid];
      this.setState({
        shopCart:cart
      })
      let entities = [];
      Object.keys(cart).forEach(c=>{
        entities.push(Object.values(cart[c]))
      })
      this.checkOutInfo({shopid:params.shopid,geohash:"40.099301,116.275113",entities})
    }
    //获取地址信息
    this.props.get_address({userId:this.props.userId})
    
  }
}

const mapStateToProps = state=>{
  return {
    cartList:state.cartList,
    userId:state.userInfo.user_id,
    chooseAddress:state.chooseAddress
  }
}
const mapDispatchToProps = dispatch=>{
  return {
    get_address:(info)=>dispatch({type:"GET_ADDRESS",payload:info})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderConfirm);