
import React,{Component} from 'react'
// import {connect} from 'react-redux'
import {Link,Route} from "react-router-dom"
import Header from '../../components/header/header'
import AlertTip from '../../components/alertTip/alertTip'
import pointsDetail from './children/detail'

import des from '../../assets/imgs/description.png'
import noData from '../../assets/imgs/no-log.png'
import './points.scss'
import {getUser} from '../../service/apis'
import {getStore} from '../../config/utils'

class Points extends Component{
  constructor(props){
    super(props);
    this.state = {
      points:0,
      alertTipShowFlag:false,
      alertText:""
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  getUserInfo = async ()=>{
    let result = await getUser({user_id:getStore("user_id")});
    this.setState({
      points:Number(result.point)
    })
  }
  exchange = ()=>{
    if(!this.state.points){
      this.setState({
        alertTipShowFlag:true,
        alertText:"快去赚取积分吧!"
      })
    }else{
      alert("去积分商城")
    }
  }
  closeAlert = ()=>{
    this.setState({
      alertTipShowFlag:false,
      alertText:""
    })
  }
  componentDidMount(){
    this.getUserInfo();
  }
  render(){
    return (
      <div>
        <Header title="我的积分" goBack={this.goBack}/>
        <div className="blanceWrapper">
          <section className="points_container">
            <div className="points_content">
              <div className="points_top">
                <span>当前积分</span>
                <Link to="/points/detail">
                  <div>
                    <img className="icon_des" src={des} alt=""/>
                    <span className="des_entrance">积分说明</span>
                  </div>
                </Link>
              </div>
              <p className="amount">{this.state.points.toFixed(2)} <span className="amountUnit">元</span></p>
              <div className="withdrawBtn" onClick={this.exchange}>积分兑换商品</div>
            </div>
          </section>
          <section className="transaction_container">
            <h1 className="transaction_title">最近30天积分记录</h1>
            <div className="noTransaction">
              <img src={noData} alt=""/>
              <p>无积分记录</p>
            </div>
          </section>
        </div>
        {this.state.alertTipShowFlag && <AlertTip alertText={this.state.alertText} closeAlert={this.closeAlert}/>}
      
        <Route path="/points/detail" component={pointsDetail}/>
      </div>
    )
  }
}

export default Points;