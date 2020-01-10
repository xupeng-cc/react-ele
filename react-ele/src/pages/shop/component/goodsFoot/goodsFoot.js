import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import style from './goodsFoot.module.scss'
import store from '../../../../store'
import Icon from '../../../../components/incon/icon'
import BuyCart from '../buyCart/buyCart'
import * as user from '../../../../store/action-type'
import {connect} from 'react-redux'

const testImgPath = "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750";
class GoodsFoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartList: store.getState().cartList[props.shopid] || {},  //当前店铺加购商品数据
      listShow: false,      //选择的商品是否展示
      logoColor:"#141d27",   //#3190e8
      totalPrice:0,         //加购商品总价
      totalCount:0          //加购商品总数量
    }
    store.subscribe(this.update)
  }
  //检测该店铺内加购商品的变化情况
  update = () => {
    let shopid = this.props.shopid;
    let cartList = store.getState().cartList[shopid];
    this.setState({
      cartList
    },()=>{
      this.setState({
        logoColor:this.cartHasFood()?"#3190e8":"#141d27"
      })
      //蒙层显示的情况下监听加购商品数量
      if(this.state.listShow){
        this.setState({
          listShow:this.cartHasFood()?true:false,
        })
      }
      this.calcTotalPrice();
    })
  }
  //计算加购商品总数和总价
  calcTotalPrice(){
    let totalPrice = 0,totalCount = 0;
    let { cartList } = this.state;
    for(let key in cartList){
      let cate = cartList[key];
      for(let cateKey in cate){
        totalCount+=cate[cateKey]["num"];
        totalPrice+=(cate[cateKey]["num"]*cate[cateKey]["price"])
      }
    }
    this.setState({
      totalPrice,
      totalCount
    })
  }
  //清空购物车
  emptyCart(){
    let shopid = this.props.shopid;
    this.props.EMPTY_CART({shopid})
  }
  //前往订单确认页
  goOrderConfirm(){
    if(this.state.totalPrice>=this.props.minumOrderAmount){
      this.props.history.push({
        pathname:"/orderConfirm",
        search:"?shopid="+this.props.shopid
      })
    }
  }
  render() {
    let { listShow, cartList,logoColor,totalPrice,totalCount } = this.state;
    let {shopid,minumOrderAmount} = this.props;
    let currentShopCartList = cartList;
    return (
      <div style={{position:"relative",zIndex:1}}>
        <footer className={style.goodsFooter}>
          <div className={style.footerContent}>
            <div className={style.goodsFooter_left}>
              <div className={style.logoWrapper} onClick={() => this.cartHasFood() && this.setState({ listShow: !listShow })}>
                <Icon iconName="shopCar" fill={logoColor} iconStyle={{ width: "1.6rem", height: "1.6rem" }}></Icon>
                {totalCount>0 && <span className={style.logo_sum}>{totalCount}</span>}
              </div>
              <div className={style.subPrice}>
                <p>￥{totalPrice.toFixed(2)}</p>
                <p>配送费￥2元</p>
              </div>
            </div>
            <div className={[style.goodsFooter_right,totalPrice>=minumOrderAmount?style.active:""].join(" ")} onClick={()=>this.goOrderConfirm()}>
              { totalPrice<1?"￥"+minumOrderAmount+"起送":(totalPrice>=minumOrderAmount?"去结算":`差￥${minumOrderAmount-totalPrice}元起送`) }
            </div>
          </div>
          {listShow && (
            <div className={style.goodsFooterModel} onClick={() => this.setState({ listShow: !listShow })}></div>
          )}
          {listShow && (
            <div className={style.selectFoods_box}>
              <div className={[style.selectFoods_head, "clear"].join(" ")}>
                <span className="left">购物车</span>
                <span className="right" onClick={()=>this.emptyCart()}>清空</span>
              </div>
              <ul className={style.selectFoods_list}>
                {currentShopCartList && Object.keys(currentShopCartList).map(category_id => (
                  Object.keys(currentShopCartList[category_id]).map(food => {
                    let currentFood = currentShopCartList[category_id][food];
                    return (
                      <li className={style.selectFoods_li} key={currentFood.item_id}>
                        <img src={testImgPath} alt="" />
                        <div className={style.selectFoods_des}>
                          <p>{currentFood.name}</p>
                          <div>
                            <span className={style.subPrice}>￥{currentFood.price * currentFood.num}</span>
                            <BuyCart shopid={shopid} category_id={category_id} food={currentFood}></BuyCart>
                          </div>
                        </div>
                      </li>
                    )
                  })
                ))}
              </ul>
            </div>
          )}
        </footer>
      </div>
    )
  }
  //购物车是否有数据
  cartHasFood(){
    let {cartList} = this.state;
    if(cartList){
      let category = Object.keys(cartList);
      if(category.length>0){
        return Object.keys(cartList[category[0]]).length>0
      }
      return false
    }
    return false;
  }
  componentDidMount(){
    this.setState({
      logoColor:this.cartHasFood()?"#3190e8":"#141d27"
    })
    this.update();
  }
}

const mapStateToProps = (state)=>{
  return {}
}
const mapDispatchToProps = (dispatch)=>{
  return {
    [user.EMPTY_CART] : (info)=>dispatch({type:"EMPTY_CART",payload:info})
  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(GoodsFoot))