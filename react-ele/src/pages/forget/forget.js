import React,{Component} from 'react'
import Header from '../../components/header/header'
import AlertTip from '../../components/alertTip/alertTip'
import './forget.scss'

import {getStore} from '../../config/utils'
import {getCode,changePwd} from '../../service/apis'

class Forget extends Component{
  constructor(props){
    super(props);
    this.state = {
      alertShowFlag:false,
      codeImg:"",
      username:"",
      oldPwd:"",
      newPwd:"",
      reNewPwd:"",
      code:"",
      alertText:"错误提示信息"
    }
  }
  closeAlert= ()=>{
    this.setState({
      alertShowFlag:false
    })
  }
  goBack = ()=>{
    this.props.history.goBack();
  }
  getCodeImgUrl = async()=>{
    let result = await getCode();
    this.setState({
      codeImg:result.code
    })
  }
  handleInput(val,type){
    this.setState({
      [type]:val
    })
  }
  modify = async ()=>{
    let {username,oldPwd:oldpassWord,newPwd:newpassword,reNewPwd:confirmpassword,code:captcha_code} = this.state;
    let _msg = "",flag = false;
    if(!username){
      _msg = "请输入用户名";
      flag = true;
    }else if(!oldpassWord){
      _msg = "请输入旧密码";
      flag = true;
    }else if(!newpassword){
      _msg = "请输入新密码";
      flag = true;
    }else if(!confirmpassword){
      _msg = "请重新输入新密码";
      flag = true;
    }else if(newpassword && confirmpassword && newpassword!==confirmpassword){
      _msg = "两次密码输入不一致，请重新确认";
      flag = true;
    }else if(!captcha_code){
      _msg = "请输入图形验证码";
      flag = true;
    }
    if(flag){
      this.setState({
        alertShowFlag:true,
        alertText:_msg
      })
      return;
    }

    let result = await changePwd({username,oldpassWord,newpassword,confirmpassword,captcha_code,user_id:getStore("user_id")})
    if(result.status === 1){
      this.props.history.goBack();
    }else{
      this.setState({
        alertShowFlag:true,
        alertText:result.message
      })
    }

  }
  componentDidMount(){
    this.getCodeImgUrl()
  }
  render(){
    return (
      <div>
        <Header title="重置密码" goBack={this.goBack}/>
        <div className="forgetWrapper">
          <form action="#" className="inputBoxWrapper">
            <div className="inputBox">
              <input type="text" placeholder="账号" value={this.state.userName} onChange={(e)=>this.handleInput(e.target.value,"username")}/>
            </div>
            <div className="inputBox">
              <input type="text" placeholder="旧密码" value={this.state.userName} onChange={(e)=>this.handleInput(e.target.value,"oldPwd")}/>
            </div>
            <div className="inputBox">
              <input type="text" placeholder="重新输入新密码" value={this.state.userName} onChange={(e)=>this.handleInput(e.target.value,"newPwd")}/>
            </div>
            <div className="inputBox">
              <input type="text" placeholder="重新输入新密码" value={this.state.userName} onChange={(e)=>this.handleInput(e.target.value,"reNewPwd")}/>
            </div>
            <div className="inputBox code_container">
              <input type="number" placeholder="验证码" value={this.state.code} onChange={(e)=>this.handleInput(e.target.value,"code")}/>
              <div className="code_img">
                <img src={this.state.codeImg} alt=""/>
                <div className="changeImg" onClick={this.getCodeImgUrl}>
                  <p>看不清</p>
                  <p className="changeImgMark">换一张</p>
                </div>
              </div>
            </div>
          </form>
          <button type="button" className="loginBtn" onClick={this.modify}>确认修改</button>
        </div>

        {this.state.alertShowFlag && <AlertTip alertText={this.state.alertText} closeAlert={this.closeAlert}/>}

      </div>
    )
  }
}

export default Forget;