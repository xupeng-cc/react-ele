import React,{Component} from 'react'
import {Link,Switch,Route} from 'react-router-dom'
import './benefit.scss'
import Header from '../../components/header/header'
import Load from '../../components/loading/loading'
import des from '../../assets/imgs/description.png'
import voucher from '../../assets/imgs/voucher.png'
import {getHongBaoCount} from '../../service/apis'
import {getStore} from '../../config/utils'

import hbdetail from './children/hbDetail'
import benefitVdetail from './children/voucherDetail'
import historyHb from './children/historyHb'

class Benefit extends Component{
  constructor(props){
    super(props);
    this.state = {
      categoryType:"1",
      hongBaoList:[],
      loadingFlag:true
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  getHongBao = async ()=>{
    let result = await getHongBaoCount({user_id:getStore("user_id"),limit:20,offset:0});
    this.setState({
      hongBaoList:result,
      loadingFlag:false
    })
  }
  componentDidMount(){
    this.getHongBao();
  }
  tabChange(type){
    this.setState({
      categoryType:type
    })
  }
  render(){
    return (
      <div>
        <Header title="我的优惠" goBack={this.goBack}/>
        <div className="benefitWrapper">
          <header className="category_title">
            <span className={this.state.categoryType==="1"?"actived":""} onClick={()=>this.tabChange("1")}>红包</span>
            <span className={this.state.categoryType==="2"?"actived":""} onClick={()=>this.tabChange("2")}>商家代金券</span>
          </header>
          {this.state.categoryType==="1"? <HongBaoContain hongBaoList={this.state.hongBaoList}/>:<VoucherContainer/>}
        </div>
        
        {this.state.loadingFlag && <Load></Load>}

        <Switch>
          <Route path="/benefit/hbdetail" component={hbdetail}/>
          <Route path="/benefit/vdetail" component={benefitVdetail}/>
          <Route path="/benefit/historyhb" component={historyHb}/>
        </Switch>
      </div>
    )
  }
}

function HongBaoContain({hongBaoList}){
  return (
    <div className="hongbao_container">
      <header className="hongbao_title">
        <div>有 <span className="hongbao_count">{hongBaoList.length}</span> 个红包即将到期</div>
        <div className="hongbao_des">
          <Link to="/benefit/hbdetail">
            <img className="icon_des" src={des} alt="说明图标"/>
            <span>红包说明</span>
          </Link>
        </div>
      </header>
      <section>
        {hongBaoList.map((hb,index) => (
          <HongBaoItem detail={hb} key={index}></HongBaoItem>
        ))}
        <Link to="/benefit/historyhb">
          <p className="historyHb">查看历史红包>>></p>
        </Link>
      </section>

      {/*<Switch>
        <Route path="/profile/benefit/hbdetail" component={test}/>
      </Switch>*/}



    </div>
  )
}
function HongBaoItem({detail}){
  return (
    <div className="hongbao_item">
      <div className="hongbao_item_left">
        <p className="hongbao_amount">
          <span>￥</span><span>1</span><span>.</span><span>0</span>
        </p>
        <p className="hongbao_amountDes">{detail.description_map.sum_condition}</p>
      </div>
      <div className="hongbao_item_center">
        <p>{detail.name}</p>
        <p>{detail.description_map.validity_periods}</p>
        <p>{detail.description_map.phone}</p>
      </div>
      <div className="hongbao_item_right">
        <span>{detail.description_map.validity_delta}</span>
      </div>
    </div>
  )
}

function VoucherContainer(){
  return (
    <div className="voucher_container">
      <header className="voucher_title">
        <div> </div>
        <div className="voucher_des">
          <Link to="/benefit/vdetail">
            <img className="icon_des" src={des} alt="说明图标"/>
            <span>商家代金券</span>
          </Link>
        </div>
      </header>
      <section className="no_Voucher_Contain">
        <img className="icon_noVoucher" src={voucher} alt=""/>
        <p>无法使用代金券</p>
        <p>非客户端或客户端版本过低</p>
      </section>
    </div>
  )
}

export default Benefit;