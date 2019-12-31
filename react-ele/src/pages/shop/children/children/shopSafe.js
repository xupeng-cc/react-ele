import React, { Component } from 'react'
import style from './shopSafe.module.scss'
import Header from "../../../../components/header/header"
import { connect } from 'react-redux'
import BScroll from 'better-scroll'

class ShopSafe extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  goBack = () => {
    this.props.history.goBack();
  }
  componentDidMount(){
    new BScroll("#scroll_section")
  }
  render() {
    let { shopDetail } = this.props;
    return (
      <div className={style.safe_shop}>
        <Header title="食品监督安全公示" goBack={this.goBack}></Header>
        <section id="scroll_section" className={style.scroll_container}>
          <section>
            <section className={style.shop_status_container}>
              <header>食品监督安全公示</header>
              <section className={style.shop_statu_detail}>
                <div>
                  1
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
            <section className={style.shop_status_container}>
              <header>
                <span>工商登记信息</span>
              </header>
              <ul>
                <li>
                  <p>企业名称</p>
                  <p>{shopDetail.identification.company_name}</p>
                </li>
                <li>
                  <p>工商执照注册号</p>
                  <p>{shopDetail.identification.identificate_agency}</p>
                </li>
                <li>
                  <p>注册资本</p>
                  <p>{shopDetail.identification.registered_number}</p>
                </li>
                <li>
                  <p>注册地址</p>
                  <p>{shopDetail.identification.registered_address}</p>
                </li>
                <li>
                  <p>属地监管所</p>
                  <p>{shopDetail.identification.registered_principal}</p>
                </li>
                <li>
                  <p>法定代表人</p>
                  <p>{shopDetail.identification.legal_person}</p>
                </li>
                <li>
                  <p>经营范围</p>
                  <p>{shopDetail.identification.operation_period}</p>
                </li>
              </ul>
            </section>
            <section className={style.shop_status_container}>
              <header>餐饮许可证</header>
              <ul>
                <li>
                  <p>营业范围</p>
                  <p>{shopDetail.identification.operation_period}</p>
                </li>
                <li>
                  <p>许可证有效期</p>
                  <p>{shopDetail.identification.licenses_date}</p>
                </li>
                <li>
                  <p>许可证号</p>
                  <p>{shopDetail.identification.licenses_number}</p>
                </li>
                <li>
                  <p>发证时间</p>
                  <p>{shopDetail.identification.licenses_scope}</p>
                </li>
                <li>
                  <p>发证机关</p>
                  <p>{shopDetail.identification.registered_principal}</p>
                </li>
              </ul>
            </section>
            <section className={[style.license_img,style.shop_status_container].join(" ")}>
              <header>许可证书</header>
              <div className={style.img_container}>
                <img src="https://www.baidu.com/img/baidu_resultlogo@2.png" alt=""/>
                {/* <img :src="localapi || proapi ? imgBaseUrl + shopDetail.license.business_license_image : getImgPath(shopDetail.license.business_license_image)"> */}
                {/* <img :src="localapi || proapi ? imgBaseUrl + shopDetail.license.catering_service_license_image : getImgPath(shopDetail.license.catering_service_license_image)"> */}
              </div>
            </section>
          </section>
        </section>


      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    shopDetail: state.shopDetailInfo
  }
}

export default connect(mapStateToProps)(ShopSafe);