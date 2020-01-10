import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { getRateScore, getRateTags, getRateList } from '../../../../service/apis'
import BScroll from 'better-scroll'
import style from './rate.module.scss'
import Star from '../../../../components/star/star'
import { getImgPath } from '../../../../config/utils'


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
        <div>
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
              <RateItem key={item._id} detail={item} pathname={this.props.location.pathname}></RateItem>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
//评论项
function RateItem({ detail,pathname }) {
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
                <Link to={{ pathname: `${pathname}/previewImage`, query: { imgPath: getImgPath(img.image_hash), imgPathList: createImgList(detail.item_ratings) } }} key={img._id}>
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

export default withRouter(Rate);