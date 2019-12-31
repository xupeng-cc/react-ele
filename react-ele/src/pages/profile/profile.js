import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link,Route} from 'react-router-dom'
// import {fromJS,is} from 'immutable'
import './profile.scss'
import {getUser} from '../../service/apis'
import {getStore} from '../../config/utils'
import store from '../../store/index'

import Footer from '../../components/footer/footer'
import Header from '../../components/header/header'
import Load from '../../components/loading/loading'
import logo from '../../assets/imgs/logo512.png';
import {imgBaseUrl} from '../../config/utils'

import info from '../info/info'



class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      loaddingFlag:true,
      newUserInfo:{},
      user_id:"",
      username:"登录/注册",
      mobile:"暂无绑定手机号",
      balance: 0,            //我的余额
      count : 0,             //优惠券个数
      pointNumber : 0,       //积分数
      avatar: '',             //头像地址
    }
    store.subscribe(this.initData) //通过 store.subscribe同步store状态的变化
  }
  initData = ()=>{
    // let _userInfo = userInfo || this.props.userInfo;
    let _userInfo = store.getState().userInfo;
    if(_userInfo.user_id){
      this.setState({
        user_id:_userInfo.user_id || '',
        username:_userInfo.username || "登录/注册",
        balance:_userInfo.balance || 0,
        count:_userInfo.gift_amount || 0,
        pointNumber:_userInfo.point || 0,
        avatar:_userInfo.avatar || ''
      })
    }else{
      this.setState({
        user_id:"",
        username:"登录/注册",
        avatar:"",
        balance: 0,
        count:0,
        pointNumber:0
      })
    }
  }
  getUserInfo = async ()=>{
    let result = await getUser({"user_id":getStore("user_id")});
    result.user_id && this.props.saveUserInfo(result);
    this.initData();
    this.setState({
      loaddingFlag:false
    })
  }
  componentDidMount(){
    this.getUserInfo();
  }
  render(){
    let list = [
      [
        {"path":"/order","text":"我的订单"},
        {"path":"/","text":"积分商城"},
        {"path":"/","text":"渴了吗会员卡"}
      ],
      [
        {"path":"/","text":"服务中心"},
        {"path":"/","text":"下载渴了吗"}
      ]
    ]
    return (
      <div>
        <Header title="我的"/>
        <section className="profileContent">
          <Link to={this.state.user_id?'/profile/info':'/login'}>
            <header className="userInfoBox">
              <img className="privateImage" src={this.state.avatar?`${imgBaseUrl}${this.state.avatar}`:logo} alt=""/>
              <div className="userInfo">
                <p>{this.state.username}</p>
                <p className="bindPhone">{this.state.mobile}</p>
              </div>
            </header>
          </Link>
          <div className="info-data">
            <ul>
              <Link to={this.state.user_id?'/blance':'/login'}>
                <li className="info-data-link">
                <span className="info-data-link-top">
                  <b>{this.state.balance.toFixed(2)}</b>元
                </span>
                  <span className="info-data-link-bottom">我的余额</span>
                </li>
              </Link>
              <Link to={this.state.user_id?'/benefit':'/login'}>
                <li className="info-data-link">
                <span className="info-data-link-top">
                  <b>{this.state.count}</b>个
                </span>
                  <span className="info-data-link-bottom">我的优惠</span>
                </li>
              </Link>
              <Link to={this.state.user_id?'/points':'/login'}>
                <li className="info-data-link">
                  <span className="info-data-link-top">
                    <b>{this.state.pointNumber}</b>分
                  </span>
                  <span className="info-data-link-bottom">我的积分</span>
                </li>
              </Link>
            </ul>
          </div>


          <div>
            {list.map((subList,index)=>(
              <ul className="profileList" key={index}>
                {subList.map((item)=>(
                  <Link to={this.state.user_id?item.path:"/login"} key={item.text}>
                    <li className="profileItem">{item.text}</li>
                  </Link>
                ))}
              </ul>
            ))}
          </div>

        </section>
        
        {this.state.loaddingFlag && <Load></Load>}

        {/*用户信息页面*/}
        <Route path="/profile/info" component={info}/>

        <Footer url={this.props.match.url}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo:state.userInfo
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    saveUserInfo:(info)=>dispatch({type:"SAVEUSERINFO",payload:info})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile)