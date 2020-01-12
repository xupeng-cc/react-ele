//商品选择组件

import React, { Component } from 'react'
import BScroll from 'better-scroll'
import BuyCart from '../buyCart/buyCart'
import GoodsFoot from '../goodsFoot/goodsFoot'
import {getRestaurantMenu} from '../../../../service/apis'
import style from './good.module.scss'
import { imgBaseUrl } from '../../../../config/utils'

const testImgPath = "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750";
class Good extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods: null,
      goodsScroll: null,
      menuScroll: null,
      listHeight: [],
      menuIndex: 0
    }
  }
  clcLiHeight() {
    let goodsListHeight = [], height = 0;
    let foodsTypeItems = this.refs.foodsTypeItems.children;
    goodsListHeight.push(height)
    for (let i = 0, len = foodsTypeItems.length; i < len; i++) {
      height += foodsTypeItems[i].clientHeight;
      goodsListHeight.push(height)
    }
    this.setState(() => ({ listHeight: goodsListHeight }))
  }
  //点击分类栏
  chooseMenu(index) {
    let { goodsScroll, listHeight } = this.state;
    goodsScroll.scrollTo(0, -listHeight[index], 600);
    this.setState({ menuIndex: index })
  }
  setFoodNum(menu) {
    menu.forEach(outer => {
      outer.foods.forEach(inner => {
        inner.count = 0
      })
    })
    return menu;
  }
  async componentDidMount() {
    let goods = await getRestaurantMenu({ restaurant_id: this.props.shopid });
    goods = this.setFoodNum(goods);
    this.setState(() => ({ goods }))

    let menuScroll = new BScroll("#menuWrapper", { click: true });
    let goodsScroll = new BScroll("#goodsWrapper", {
      click: true,
      bounce: {
        top: false, bottom: false
      }
    });
    this.setState({
      menuScroll,
      goodsScroll
    })
    this.clcLiHeight();
  }
  render() {
    let { goods, menuIndex } = this.state;
    if (!goods) {
      return null;
    }
    return (
      <div className={style.goods}>
        <div className={style.menuWrapper} id="menuWrapper">
          <ul>
            {goods.map((good, index) => (
              <li key={good.id} className={[style.menuItem, menuIndex === index ? style.current : ""].join(" ")} onClick={() => this.chooseMenu(index)}>
                <span>{good.name}</span>
              </li>
            ))}

          </ul>
        </div>
        <div className={style.goodsWrapper} id="goodsWrapper">
          <ul ref="foodsTypeItems">
            {goods.map(foods => (
              <li className={style.foodsTypeItem} key={foods.name}>
                <h1>{foods.name}</h1>
                <ul>
                  {foods.foods.map(food => (
                    <FoodItem food={food} shopid={this.props.shopid} category_id={foods.id} key={food._id}></FoodItem>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <GoodsFoot {...this.props}></GoodsFoot>
      </div>
    )
  }
}
class FoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: props.food
    }
  }
  componentDidMount() {

  }
  render() {
    let { food } = this.state;
    return (
      <li className={style.foodsItem}>
        <div className={style.foodImg}>
          <img src={imgBaseUrl+food.image_path} width="64" height="64" alt="" />
        </div>
        <div className={style.foodContent}>
          <p className={style.foodName}>{food.name}</p>
          <p className={style.foodDes}>{food.description}</p>
          <div className={style.foodData}>
            <span>月售{food.month_sales}份</span> <span>好评率{food.satisfy_rate}%</span>
          </div>
          <div className={style.foodPrice}>
            <span className={style.currentPrice}>￥{food.specfoods[0].price}</span>
            <span className={style.oldPrice}>￥{food.oldPrice}</span>
          </div>
          <BuyCart {...this.props}></BuyCart>
        </div>
      </li>
    )
  }
}

export default Good;