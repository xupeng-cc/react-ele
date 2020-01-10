import React,{Component} from 'react';
import store from '../../../../store/index'
import style from './buyCart.module.scss'
import {connect} from 'react-redux'
import * as user from '../../../../store/action-type'

//加减控制组件
class BuyCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodNum: 0
    }
    //监听cartList的变化
    store.subscribe(this.getNum)
  }
  //改变商品数量
  changeFoodCount(offset) {
    let foodNum = this.state.foodNum;
    foodNum += offset;
    if (foodNum < 0) {
      foodNum = 0;
    }
    this.setState(() => ({
      foodNum
    }))
    let { shopid, category_id, food } = this.props;
    if (offset > 0) {
      this.props.addCart({ shopid, category_id, foodid: food.item_id, name: food.name, price: food.price || food.specfoods[0].price })
    } else {
      this.props.reduceCart({ shopid, category_id, foodid: food.item_id, name: food.name, price: food.price || food.specfoods[0].price })
    }
  }
  //初始化商品数量
  getNum = () => {
    let cartList = store.getState().cartList;
    let { shopid, category_id, food } = this.props;
    if (cartList[shopid] && cartList[shopid][category_id] && cartList[shopid][category_id][food.item_id]) {
      let num = cartList[shopid][category_id][food.item_id]["num"];
      this.setState({ foodNum: num });
    } else {
      this.setState({ foodNum: 0 });
    }
  }
  render() {
    let { foodNum } = this.state;
    return (
      <div className={style.cartControlWrapper}>
        <div className={style.cartControl}>
          <div className={style.cart_reduce} onClick={() => this.changeFoodCount(-1)}>
            <span className={style.reduce}>-</span>
          </div>
          <div className={style.count}>{foodNum}</div>
          <div className={style.cart_add} onClick={() => this.changeFoodCount(1)}>
            <span className={style.increase}>+</span>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.getNum();
  }
}

const mapStateToProps = (state) => {
  return {
    
  }
}
const mapDipatchToProps = (dispatch) => {
  return {
    addCart: (info) => dispatch({ type: user.ADD_CART, payload: info }),
    reduceCart: (info) => dispatch({ type: user.REDUCE_CART, payload: info })
  }
}

export default connect(mapStateToProps,mapDipatchToProps)(BuyCart);