import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom"
import Icon from '../../components/incon/icon'
import Star from '../../components/star/star'
import style from './shop.module.scss'
import { Link } from 'react-router-dom'
import { getShopDetail } from '../../service/apis'
import { imgBaseUrl } from '../../config/utils'
import shopDetailCom from "./children/shopDetail"
import { connect } from 'react-redux'
import * as user from "../../store/action-type"
import PreviewImage from '../../components/previewImage/previewImage'
import Rate from './component/rate/rate'
import Good from './component/good/good'


class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopDetail: {},
      activitiesShowFlag: false,   //优惠活动显示开关
      changeShowType: "food",      //显示商品或评价
    }
  }
  goBack = () => {
    this.props.history.goBack();
  }
  //关闭优惠信息蒙层
  closeActivies() {
    this.setState({ activitiesShowFlag: false })
  }
  changeShowType(type) {
    this.setState({ changeShowType: type })
  }
  async componentDidMount() {
    let shopid = this.props.match.params.id;
    let shopDetail = await getShopDetail({ shopId: shopid });
    this.setState({ shopDetail })
    this.props.record_shop_detail(shopDetail)


  }
  render() {
    let { shopDetail, activitiesShowFlag } = this.state;
    let headerFooter;
    if (shopDetail.activities && shopDetail.activities.length > 0) {
      headerFooter = <footer className={style.description_footer} onClick={() => this.setState({ activitiesShowFlag: true })}>
        <p className={style.ellipsis}>
          <span className={style.tip_icon}>名字</span>
          <span>{shopDetail.activities[0].description}（APP专享）</span>
        </p>
        <p>{shopDetail.activities.length}个活动</p>
        <Icon iconName="right" fill="white" iconClass={style.footer_arrow}></Icon>
      </footer>
    } else {
      headerFooter = ""
    }

    return (
      <div>
        {/* <nav className={style.goBack} onClick={() => this.goBack()}>
          <Icon iconName="left" fill="white" iconStyle={{ width: "1rem", height: "1rem" }}></Icon>
        </nav>
        <section className={style.shop_wrapper}>
          <header className={style.shop_detail_header}>
            <img src={imgBaseUrl + shopDetail.image_path} alt="" className={style.header_cover_img} />
            <section className={style.description_header}>
              <Link to={this.props.match.url + "/shopDetail"} className={style.description_top}>
                <section className={style.description_left}>
                  <img src={imgBaseUrl + shopDetail.image_path} alt="" />
                </section>
                <section className={style.description_right}>
                  <h4 className={[style.description_title, style.ellipsis].join(" ")}>{shopDetail.name}</h4>
                  <p className={style.description_text}>商家配送／{shopDetail.order_lead_time}分钟送达／配送费¥{shopDetail.float_delivery_fee}</p>
                  <p className={[style.description_promotion, style.ellipsis].join(" ")}>公告：{shopDetail.promotion_info}</p>
                </section>
                <div className={style.description_arrow}>
                  <Icon iconName="right" fill="white" iconStyle={{ width: "0.7rem", height: "0.7rem" }}></Icon>
                </div>
              </Link>
              {headerFooter}
            </section >
            
            {activitiesShowFlag && <ActivitiesDetail
              name={shopDetail.name}
              rate={shopDetail.rating}
              activities={shopDetail.activities}
              promotionInfo={shopDetail.promotion_info}
              parent={this}
            ></ActivitiesDetail>}
          </header>
        </section > */}
        <section className={style.shopDetailHead}>
          <div onClick={() => this.goBack()}>
            <Icon iconName="left" fill="#fff" iconClass={style.icon_back}></Icon>
          </div>
          <Link to={this.props.match.url + "/shopDetail"}>
            <div className={style.shopDetailHead_top}>
              <img className={style.shopImg} src={imgBaseUrl + shopDetail.image_path} alt=""/>
              <div className={style.shopText}>
                <p>店铺名字</p>
                <p>商家配送／{shopDetail.order_lead_time}分钟送达／配送费¥{shopDetail.float_delivery_fee}</p>
                <p>公告：{shopDetail.promotion_info}</p>
              </div>
              <Icon iconName="right" fill="white" iconClass={style.icon_right}></Icon>
            </div>
          </Link>
          <p className={style.actives}>优惠信息</p>
        </section>
        <header className={style.shop_detail_container_nav}>
          <div className={this.state.changeShowType === "food" ? style.active : ""} onClick={() => this.changeShowType("food")}>
            <span>商品</span>
          </div>
          <div className={this.state.changeShowType === "rate" ? style.active : ""} onClick={() => this.changeShowType("rate")}>
            <span>评价</span>
          </div>
        </header>

        <section className={style.showWrapper} id="showWrapper">
          <div style={{ display: this.state.changeShowType === "food" ? "block" : "none" }}>
            <Good shopid={this.props.match.params.id} minumOrderAmount={shopDetail.float_minimum_order_amount}></Good>
          </div>
          <div style={{ display: this.state.changeShowType === "rate" ? "block" : "none" }}>
            <Rate shopid={this.props.match.params.id}></Rate>
          </div>
        </section>


        <Switch>
          <Route path={this.props.match.url + "/shopDetail"} component={shopDetailCom}></Route>
          <Route path={this.props.match.url + "/previewImage"} component={PreviewImage}></Route>
        </Switch>
      </div>
    )
  }
}
//更多公告
function ActivitiesDetail({ name, rate, activities, promotionInfo, parent }) {
  return (
    <section className={style.activities_details}>
      <h2 className={style.activities_shoptitle}>{name}</h2>

      <h3 className={style.activities_ratingstar}>
        <Star rate={rate}></Star>
      </h3>
      <section className={style.activities_list}>
        <header className={style.activities_title_style}><span>优惠信息</span></header>
        <ul>
          {activities.map(item => (
            <li key={item.id}>
              <span className={style.activities_icon}>{item.icon_name}</span>
              <span>{item.description}（APP专享）</span>
            </li>
          ))}
        </ul>
      </section >
      <section className={style.activities_shopinfo}>
        <header className={style.activities_title_style}><span>商家公告</span></header>
        <p>{promotionInfo}</p>
      </section>
      <div className={style.close_activities} onClick={() => parent.closeActivies()}>
        <Icon iconName="close" fill="#ccc" iconStyle={{ width: "100%", height: "100%" }}></Icon>
      </div>
    </section >
  )
}

const mapStateToProps = (state) => {
  return {
    cartList: state.cartList
  }
}
const mapDipatchToProps = (dispatch) => {
  return {
    record_shop_detail: (info) => dispatch({ type: user.RECORD_SHOP_DETAIL, payload: info }),
    addCart: (info) => dispatch({ type: user.ADD_CART, payload: info }),
    reduceCart: (info) => dispatch({ type: user.REDUCE_CART, payload: info })
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(Shop);