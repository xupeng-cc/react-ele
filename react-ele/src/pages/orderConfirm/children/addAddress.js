import React, { Component } from 'react'
import Header from '../../../components/header/header'
import style from './addAddress.module.scss'
import Icon from '../../../components/incon/icon'

class AddAddress extends Component {
  goBack(){
    this.props.history.goBack();
  }
  render() {
    return (
      <div className={style.addAddress_wrapper}>
        <Header title="添加地址" goBack={()=>this.goBack()}></Header>
        <div className={style.addAddress_container}>
          <section className={style.input_box}>
            <span className={style.input_left}>联系人</span>
            <div className={style.input_right}>
              <input type="text" placeholder="你的名字"/>
              <div className={style.input_gender}>
                <div className={style.genderItem}>
                  <Icon iconName="choose" fill="#ccc" iconStyle={{width:"0.8rem",height:"0.8rem"}}></Icon>
                  <span>先生</span>
                </div>
                <div className={style.genderItem}>
                  <Icon iconName="choose" fill="#ccc" iconStyle={{width:"0.8rem",height:"0.8rem"}}></Icon>
                  <span>女士</span>
                </div>
              </div>
            </div>
          </section>
          <section className={style.input_box}>
            <span className={style.input_left}>联系电话</span>
            <div className={style.input_right}>
              <input type="number" placeholder="你的手机号"/>
            </div>
          </section>
          <section className={style.input_box}>
            <span className={style.input_left}>送餐地址</span>
            <div className={style.input_right}>
              <input type="text" placeholder="小区/写字楼/学校等" disabled/>
              <input type="text" placeholder="详细地址（门牌号等）"/>
            </div>
          </section>
          <section className={style.input_box}>
            <span className={style.input_left}>标签</span>
            <div className={style.input_right}>
              <input type="text" placeholder="无/家/公司/学校"/>
            </div>
          </section>
        </div>
        <div className={style.confirmAdd}>确定</div>
      </div>
    )
  }
}

export default AddAddress;