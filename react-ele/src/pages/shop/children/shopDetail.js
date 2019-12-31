import React, { Component } from 'react'
import style from './shopDetail.module.scss'
import Header from "../../../components/header/header"
import Icon from '../../../components/incon/icon'
import { Link,Prompt } from 'react-router-dom'
import BScroll from 'better-scroll'
import { connect } from "react-redux"
import { Route } from 'react-router-dom'
import shopSafe from "./children/shopSafe"
import {imgBaseUrl} from '../../../config/utils'

class ShopDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenseImg:""
    }
  }
  goBack = () => {
    this.props.history.goBack();
  }
  //查看证件照
  showLicense = (licenseImg)=>{
    let imgPath = licenseImg || ""
    this.setState({
      licenseImg:imgPath
    })
  }
  componentDidMount() {
    new BScroll("#shop_detail_content", {
      click: true,
      probeType: 2,
      bounce: { top: false }
    })
  }
  render() {
    let { shopDetail } = this.props;
    let {licenseImg} = this.state;
    console.log(this.props)
    return (
      <div className={style.shop_detail_wrapper}>
        <Header title="商家详情" goBack={this.goBack}></Header>
        <section className={style.shop_detail_content} id="shop_detail_content">
          <div>
            <section className={style.activities_container}>
              <header>活动与属性</header>
              <ul className={style.actibities_ul}>
                {shopDetail.activities.map(item => (
                  <li key={item.id}>
                    <span style={{ backgroundColor: "#" + item.icon_color }}>{item.icon_name}</span>
                    <span>{item.description}(APP专享)</span>
                  </li>
                ))}
              </ul>
              <ul className={style.actibities_ul}>
                {shopDetail.supports.map(item => (
                  <li key={item.id}>
                    <span style={{ backgroundColor: "#" + item.icon_color }}>{item.icon_name}</span>
                    <span>{item.description}(APP专享)</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className={style.shop_status_container}>
              <Link to={this.props.match.url+"/shopSafe"} className={style.shop_status_header}>
                <span className={style.shop_detail_title}>食品监督安全公示</span>
                <div>
                  <span className={style.identification_detail}>企业认证详情</span>
                  <Icon iconName="right" fill="#bbb" iconClass={style.identification_detail_icon}></Icon>
                </div>
              </Link>
              <section className={style.shop_statu_detail}>
                <div>
                  {shopDetail.status}
                </div>
                <div className={style.check_date}>
                  <p>
                    <span>监督检查结果：</span>
                    {String(shopDetail.status) === '1' ?
                      (<span className={style.shop_status_well}>良好</span>) :
                      (<span className={style.shop_status_bad}>差</span>)
                    }
                  </p>
                  <p>
                    <span>检查日期：</span>
                    <span>{shopDetail.identification.identificate_date && shopDetail.identification.identificate_date.split('T')[0]}</span>
                  </p>
                </div>
              </section>
            </section>
            <section className={style.shop_status_info}>
              <header>商家信息</header>
              <p>{shopDetail.name}</p>
              <p>地址：{shopDetail.address}</p>
              <p>营业时间：[{shopDetail.opening_hours[0]}]</p>
              <p onClick={()=>this.showLicense(shopDetail.license.business_license_image)}>
                <span>营业执照</span>
                <Icon iconName="right" fill="#bbb" iconClass={style.cardIcon}></Icon>
              </p>
              <p onClick={()=>this.showLicense(shopDetail.license.catering_service_license_image)}>
                <span>餐饮服务许可证</span>
                <Icon iconName="right" fill="#bbb" iconClass={style.cardIcon}></Icon>
              </p>
            </section>
          </div>

        </section>
        {/* 查看图片 */}

        {this.state.licenseImg && (
          <section className={style.license_container} onClick={()=>{this.showLicense()}}>
            <img src={imgBaseUrl+this.state.licenseImg} alt=""/>
          </section>
        )}
        {/* 查看大图后安卓点击物理返回键关闭大图 */}
        <Prompt message={()=>{
          if(licenseImg){
            this.setState(()=>(
              {licenseImg:""}
            ))
            return false;
          }
          return true}
        }></Prompt>

        <Route path="/shop/:id/shopDetail/shopSafe" component = {shopSafe}></Route>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shopDetail: state.shopDetailInfo
  }
}

export default connect(mapStateToProps)(ShopDetail);