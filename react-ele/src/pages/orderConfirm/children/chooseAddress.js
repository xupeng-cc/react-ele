import React, { Component } from 'react'
import style from './chooseAddress.module.scss'
import Icon from '../../../components/incon/icon'
import {connect} from 'react-redux'
import Header from '../../../components/header/header'
import {Route,Link} from 'react-router-dom'
import AddAddress from './addAddress'

class ChooseAddress extends Component {
  constructor(props){
    super(props);
    this.state={};
  }
  goBack(){
    this.props.history.goBack();
  }
  chooseAddr(address){
    this.props.choose_address({chooseAddress:address});
    this.props.history.goBack();
  }
  render() {
    let {addressList,chooseAddress} = this.props;
    let url = this.props.match.url;
    console.log(url)
    return (
      <div className={style.chooseAddr_wrapper}>
        <Header title="选择地址" goBack={()=>this.goBack()}></Header>  
        {addressList.map(address=>(
          <div className={style.address_contailer} key={address.id} onClick={()=>this.chooseAddr(address)}>
            {address.id===chooseAddress.id &&   <Icon iconName="choose" fill="#4cd964" iconStyle={{width:"0.8rem",height:"0.8rem"}}></Icon>}
            <div className={style.addressText}>
              <p>
                <b>{address.name}</b> <span>{address.sex==1?"男":"女"}</span> <span>{address.phone}</span>
              </p>
              <p>
                <b>{address.tag}</b> <span>{address.address_detail}</span>
              </p>
            </div>
          </div>
        ))}
        <Link to={url+"/addAddress"}>
          <div className={style.addAddress}>
            <Icon iconName="add" fill="#3190e8" iconStyle={{width:"24px",height:"24px"}}></Icon>
            <span>新增收获地址</span>
          </div>
        </Link>

        <Route path={url+"/addAddress"} component={AddAddress}></Route>
      </div>
    )
  }
}

const mapStateToProps = state=>{
  return {
    addressList:state.addressList,
    chooseAddress:state.chooseAddress
  }
}
const mapDispatchToProps = dispatch=>{
  return {
    get_address:(info)=>dispatch({type:"GET_ADDRESS",payload:info}),
    choose_address:(info)=>dispatch({type:"CHOOSE_ADDRESS",payload:info})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChooseAddress);