import React,{Component} from 'react'
import './alertTip.scss'

class AlertTip extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  close = ()=>{
    this.props.closeAlert();
  }
  render(){
    return (
      <div className="alert_wrapper">
        <div className="alert_container">
          <div className="alert_icon"></div>
          <p className="alert_text">{this.props.alertText}</p>
          <div className="alertConfirm" onClick={this.close}>确定</div>
        </div>
      </div>
    )
  }
}

export default AlertTip;