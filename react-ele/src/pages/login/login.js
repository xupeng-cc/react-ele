import React,{Component} from 'react'
import {connect} from 'react-redux'
import Header from '../../components/header/header'
import AlertTip from '../../components/alertTip/alertTip'
import './login.scss'
import {login,getCode} from '../../service/apis'
import {setStore} from '../../config/utils'

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      userName:"",
      passWord:"",
      code:"",
      alertShowFlag:false,
      alertText:"",
      codeImg:""
    }
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  handleInput(val,type){
    this.setState({
      [type]:val
    })
  }
  login = async ()=>{
    let {userName,passWord,code} = this.state;
    if(!userName){
      this.setState({
        alertShowFlag:true,
        alertText:"请输入账号"
      });
      return
    }
    if(!passWord){
      this.setState({
        alertShowFlag:true,
        alertText:"请输入密码"
      });
      return
    }
    if(!code){
      this.setState({
        alertShowFlag:true,
        alertText:"请输入验证码"
      });
      return
    }
    let result = await login({username:userName,password:passWord,captcha_code:code});
    if(!result.user_id){
      this.setState({
        alertShowFlag:true,
        alertText:result.message
      });
    }else{
      setStore("user_id",result.user_id);
      this.props.saveUserInfo(result);
      this.props.history.goBack();
    }
  }
  closeAlert = ()=>{
    this.setState({
      alertShowFlag:false
    })
  }
  async componentDidMount(){
    let result = await getCode();
    this.setState({
      codeImg:result.code
    })
  }
  render(){
    return (
      <div>
        <Header title="登录页面" goBack={this.goBack}/>
        <section className="loginWrapper">
          <form action="#">
            <div className="inputBox">
              <input type="text" placeholder="请输入账号" value={this.state.userName} onChange={(e)=>this.handleInput(e.target.value,"userName")}/>
            </div>
            <div className="inputBox">
              <input type="password" placeholder="请输入密码" value={this.state.passWord} onChange={(e)=>this.handleInput(e.target.value,"passWord")}/>
            </div>
            <div className="inputBox code_container">
              <input type="number" placeholder="验证码" value={this.state.code} onChange={(e)=>this.handleInput(e.target.value,"code")}/>
              <div className="code_img">
                <img src={this.state.codeImg} alt=""/>
                <div className="changeImg">
                  <p>看不清</p>
                  <p className="changeImgMark">换一张</p>
                </div>
              </div>
            </div>
          </form>
          <div>
            <p className="loginTip">温馨提示: 未注册过的账号, 登录时自动注册</p>
            <p className="loginTip">注册过的用户可凭证账号密码登录</p>
          </div>
          <button type="button" className="loginBtn" onClick={this.login}>登录</button>
        </section>

        {this.state.alertShowFlag && <AlertTip alertText={this.state.alertText} closeAlert={this.closeAlert} />}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo:state.userInfo
  }
}
const mapDispatchTpProps = (dispatch)=>{
  return {
    saveUserInfo:(userInfo)=>dispatch({type:"SAVEUSERINFO",payload:userInfo})
  }
}

export default connect(mapStateToProps,mapDispatchTpProps)(Login);