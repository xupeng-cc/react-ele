import React,{Component} from 'react'
import BScroll from 'better-scroll'
import './historyHb.scss'

import Header from '../../../components/header/header'
import Load from '../../../components/loading/loading'
import {getHistoryHb} from '../../../service/apis'
import {getStore} from '../../../config/utils'

class HistoryHb extends Component{
  constructor(props){
    super(props);
    this.state = {
      historyHbList:[],
      loaddingFlag:true
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  getHistoryHb = async ()=>{
    let user_id = getStore("user_id");
    let result = await getHistoryHb({user_id,limit:20,offset:0});
    if(result && result.length>0){
      this.setState({
        historyHbList:result,
        loaddingFlag:false
      })
    }
    new BScroll("#historyList",{
      probeType:2,
      bounce: {top:false},
      click: true
    })
  }
  componentDidMount(){
    this.getHistoryHb();
  }
  render(){
    return(
      <div className="history_hb">
        <Header title="历史红包" goBack={this.goBack}/>
        <div className="history_hb_list">
          <div className="history_hb_contain"  id="historyList">
            <div className="history_hb_item">
              {this.state.historyHbList.map( (history,index)=>(
                <HistoryHbItem detail={history} key={index}></HistoryHbItem>
              ))}
            </div>
          </div>
        </div>
        {this.state.loaddingFlag && <Load></Load>}
      </div>
    )
  }
}

function HistoryHbItem({detail}){
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
    </div>
  )
}

export default HistoryHb;