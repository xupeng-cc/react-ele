import React,{Component} from 'react'
// import {connect} from 'react-redux'
import {Link,Route} from "react-router-dom"
import Header from '../../components/header/header'

import des from '../../assets/imgs/description.png'
import noData from '../../assets/imgs/no-log.png'
import './blance.scss'
import {getUser} from '../../service/apis'
import {getStore} from '../../config/utils'
import balanceDetail from './children/detail'

class Blance extends Component{
  constructor(props){
    super(props);
    this.state = {
      balance:0
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  getUserInfo = async ()=>{
    let result = await getUser({user_id:getStore("user_id")});
    this.setState({
      balance:Number(result.balance)
    })
  }
  componentDidMount(){
    this.getUserInfo();
  }
  render(){
    return (
      <div>
        <Header title="我的余额" goBack={this.goBack}/>
        <div className="blanceWrapper">
          <section className="balance_container">
            <div className="balance_content">
              <div className="balance_top">
                <span>当前余额</span>
                <Link to="/blance/detail">
                  <div>
                    <img className="icon_des" src={des} alt=""/>
                    <span className="des_entrance">余额说明</span>
                  </div>
                </Link>
              </div>
              <p className="amount">{this.state.balance.toFixed(2)} <span className="amountUnit">元</span></p>
              <div className="withdrawBtn">提现</div>
            </div>
          </section>
          <section className="transaction_container">
            <h1 className="transaction_title">交易明细</h1>
            <div className="noTransaction">
              <img src={noData} alt=""/>
              <p>暂无明细</p>
            </div>
            <div className="transactionList">
              明细列表
            </div>
          </section>
        </div>

        <Route path="/blance/detail" component={balanceDetail}/>
      </div>
    )
  }
}

export default Blance;