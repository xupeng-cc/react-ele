import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom"
import Icon from '../../components/incon/icon'
import Star from '../../components/star/star'
import style from './shop.module.scss'
import { Link } from 'react-router-dom'
import { getShopDetail, getRateScore, getRateTags, getRateList, getRestaurantMenu } from '../../service/apis'
import { imgBaseUrl, getImgPath } from '../../config/utils'
import shopDetailCom from "./children/shopDetail"
import { connect } from 'react-redux'
import * as user from "../../store/action-type"
import BScroll from 'better-scroll'
import PreviewImage from '../../components/previewImage/previewImage'

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
    console.log(this.props)
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
        <nav className={style.goBack} onClick={() => this.goBack()}>
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
            {/* 优惠详细信息展示 */}
            {activitiesShowFlag && <ActivitiesDetail
              name={shopDetail.name}
              rate={shopDetail.rating}
              activities={shopDetail.activities}
              promotionInfo={shopDetail.promotion_info}
              parent={this}
            ></ActivitiesDetail>}
          </header>
        </section >

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
            <Food shopid={this.props.match.params.id}></Food>
          </div>
          <div style={{ display: this.state.changeShowType === "rate" ? "block" : "none" }}>
            <Rate shopid={this.props.match.params.id}></Rate>
          </div>
        </section>

        {/* 商品选择和评价 */}
        <section className={style.shop_detail_container} style={{ display: "none" }}>
          <header className={style.shop_detail_container_nav}>
            <div className={this.state.changeShowType === "food" ? style.active : ""} onClick={() => this.changeShowType("food")}>
              <span>商品</span>
            </div>
            <div className={this.state.changeShowType === "rate" ? style.active : ""} onClick={() => this.changeShowType("rate")}>
              <span>评价</span>
            </div>
          </header>

          <section className={style.showWrapper} id="showWrapper">
            <div className={style.show_wrapper_content}>
              <div style={{ display: this.state.changeShowType === "food" ? "block" : "none" }}>
                <Food shopid={this.props.match.params.id}></Food>
              </div>
              <div style={{ display: this.state.changeShowType === "rate" ? "block" : "none" }}>
                <Rate shopid={this.props.match.params.id}></Rate>
              </div>

            </div>
          </section>

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
// 商品组件
class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods: null
    }
  }
  async componentDidMount() {
    let goods = await getRestaurantMenu({ restaurant_id: this.props.shopid });
    this.setState(() => ({ goods }))

    new BScroll("#menuWrapper")
    new BScroll("#goodsWrapper")
  }
  render() {
    let goods = this.state.goods;
    if (!goods) {
      return null;
    }
    return (
      <div className={style.goods}>
        <div className={style.menuWrapper} id="menuWrapper">
          <ul>
            {goods.map((good, index) => (
              <li key={good.id} className={[style.menuItem, "0" == index ? style.current : ""].join(" ")} onClick={() => { }}>
                <span>{good.name}</span>
              </li>
            ))}

          </ul>
        </div>
        <div className={style.goodsWrapper} id="goodsWrapper">
          <ul>
            {goods.map(foods => (
              <li className={style.foodsTypeItem} key={foods.name}>
                <h1>{foods.name}</h1>
                <ul>
                  {foods.foods.map(food => (
                    <li className={style.foodsItem} key={food._id}>
                      <div className={style.foodImg}>
                        <img src={"http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"} width="64" height="64" alt="" />
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
                        <div className={style.cartControlWrapper}>

                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
// 评价组件
class Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rateScore: null,
      rateTags: null,
      rateList: null
    }
  }
  async componentDidMount() {
    let shopid = this.props.shopid;
    let rateScore = await getRateScore({ "shopid": shopid });
    let rateTags = await getRateTags({ "shopid": shopid });
    let rateList = await getRateList({ "shopid": shopid })
    this.setState({ rateScore, rateTags, rateList })

    new BScroll("#rateContent", {
      bounce: { top: false },
      click: true,
      probeType: 2
    })
  }
  render() {
    let { rateScore, rateTags } = this.state;
    if (!rateScore) {
      return null;
    }
    return (
      <div className={style.rate_content} id="rateContent">
        <div className={style.rate_content_head}>
          <section className={style.rate_content_head_left}>
            <p>4.4</p>
            <p>综合评价</p>
            <p>高于周边商家{rateScore.compare_rating.toFixed(3) * 100 + "%"}</p>
          </section>
          <section className={style.rate_content_head_right}>
            <div>
              <span className={style.score_des}>服务态度</span>
              <div className={style.score_icon}>
                <Star rate={rateScore.service_score}></Star>
              </div>
              <span className={style.score_num}>{rateScore.service_score.toFixed(2)}</span>
            </div>
            <div>
              <span className={style.score_des}>菜品评价</span>
              <div className={style.score_icon}>
                <Star rate={rateScore.food_score}></Star>
              </div>
              <span className={style.score_num}>{rateScore.food_score.toFixed(2)}</span>
            </div>
            <div>
              <span className={style.score_des}>送达时间</span>
              <span className={style.score_time}>4.3分钟</span>
            </div>
          </section>
        </div>
        <div className={style.rate_classify}>
          <ul>
            {rateTags && rateTags.map(tag => (
              <li key={tag._id} className={style.tagItem}>{tag.name + "(" + tag.count + ")"}</li>
            ))}
          </ul>
        </div>
        <ul className={style.rateList}>
          {this.state.rateList && this.state.rateList.map(item => (
            <RateItem key={item._id} detail={item}></RateItem>
          ))}
        </ul>
        <input type="text" placeholder="请输入内容公司的客服就" />
      </div>
    )
  }
}
//评论项
function RateItem({ detail }) {
  let createImgList = (list) => {
    if (!Array.isArray(list)) {
      return [];
    }
    let imgPathList = [];
    list.forEach(item => {
      imgPathList.push(getImgPath(item.image_hash))
    })
    return imgPathList;
  }
  return (
    <li className={style.rateItem}>
      <div className={style.rate_touxiang}>
        <img src="http://test.fe.ptdev.cn/elm/elmlogo.jpeg" alt="" />
      </div>
      <div className={style.rate_item_detail}>
        <header className={style.rate_item_detailHeader}>
          <div className={style.rate_item_userTime}>
            <span className={style.rate_item_userName}>{detail.username}</span>
            <span className={style.rate_item_time}>{detail.rated_at}</span>
          </div>
          <div className={style.rate_item_score}>
            <span>评分</span>
            <div className={style.rate_score}>
              <Star rate={detail.rating_star}></Star>
            </div>
          </div>
        </header>
        <p className={style.rate_desText}>评价描述描述描述评价描述描述描述评价描述描述描述评价描述描述描述</p>
        <ul className={style.rate_foodImgList}>
          {detail.item_ratings.length > 0 && (
            detail.item_ratings.map(img => {
              return (
                <Link to={{ pathname: '/shop/3278/previewImage', query: { imgPath: getImgPath(img.image_hash), imgPathList: createImgList(detail.item_ratings) } }} key={img._id}>
                  <li className={style.rate_foodImg}>
                    <img src={getImgPath(img.image_hash)} alt="" />
                  </li>
                </Link>
              )
            })
          )}
        </ul>
      </div>
    </li>
  )
}

const mapStateToProps = (state) => {
  return {}
}
const mapDipatchToProps = (dispatch) => {
  return {
    record_shop_detail: (info) => dispatch({ type: user.RECORD_SHOP_DETAIL, payload: info })
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(Shop);