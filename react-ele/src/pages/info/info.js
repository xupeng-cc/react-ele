import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Header from '../../components/header/header'
import Load from '../../components/loading/loading'

import {getUser,logout,uploadAvatar} from '../../service/apis'
import {getStore,imgBaseUrl,removeStore} from '../../config/utils'

import './info.scss'

class Info extends Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo:{},
      loadingFlag:false
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  async getUserInfo(){
    let userInfo = await getUser({"user_id":getStore("user_id")});
    this.setState({
      userInfo
    })
  }
  //退出登录
  logout = ()=>{
    this.setState({
      loadingFlag:true
    },async ()=>{
      let result = await logout({"user_id":this.state.userInfo.user_id});
      if(result.status === 1){
        removeStore("user_id");
        this.props.logout();
        // console.log(this.props.userInfo)
        this.props.history.goBack();
        console.log(this.props.userInfo)
      }
    })
    
  }
  //上传图片
  uploadAvatar = ()=>{
    this.setState({
      loadingFlag:true
    },async ()=>{
      let input = this.refs.file;
      let formData = new FormData();
      formData.append("file",input.files[0]);
      let result = await uploadAvatar({"user_id":this.state.userInfo.user_id,formData})
      if(result.status === 1){
        let _userInfo = {...this.state.userInfo,avatar:result.image_path};
        this.props.saveUserInfo(_userInfo);
        console.log(this.props.userInfo)
        this.setState({
          userInfo:_userInfo,
          loadingFlag:false
        })
      }
    })
  }
  componentDidMount(){
    // this.getUserInfo();
    this.setState({
      userInfo:this.props.userInfo
    })
  }
  render(){
    return (
      <div className="info_page">
        <Header title="账户信息" goBack={this.goBack}/>
        <section className="infoWrapper">
          <div>
            <h1 className="info_sub"> </h1>
            <section className="infoItem avatarBox">
              <input ref="file" type="file" className="uploadAvatar" onChange={this.uploadAvatar}/>
              <span className="info_item_des">头像</span>
              <img src={imgBaseUrl+this.state.userInfo.avatar} alt=""/>
            </section>
            <section className="infoItem">
              <span className="info_item_des">用户名</span>
              <div className="info_item_content">
                <span>{this.state.userInfo.username}</span>
              </div>
            </section>
            <section className="infoItem">
              <span className="info_item_des">收货地址</span>
              <div className="info_item_content">
                <span>1212</span>
              </div>
            </section>
          </div>

          <div>
            <h1 className="info_sub">账号绑定</h1>
            <section className="infoItem">
              <span className="info_item_des">手机</span>
              <div className="info_item_content">
                <span>暂未绑定</span>
              </div>
            </section>
          </div>

          <div>
            <h1 className="info_sub">安全设置</h1>
            <Link to="/forget">
              <section className="infoItem">
                <span className="info_item_des">登录密码</span>
                <div className="info_item_content">
                  <span>修改</span>
                </div>
              </section>
            </Link>
          </div>
          {/* 加载中 */}
          {this.state.loadingFlag && <Load></Load>}
          {/*退出登录*/}
          <div className="logout" onClick={this.logout}>退出登录</div>
        </section>
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
    logout:()=>dispatch({type:"LOGOUT"}),
    saveUserInfo:(info)=>dispatch({type:"SAVEUSERINFO",payload:info})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Info);