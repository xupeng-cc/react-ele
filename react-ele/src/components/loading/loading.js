import React, { Component } from 'react';
import style from './loadding.module.scss';

export default class Loading extends Component {
  constructor(props){
    super(props)
    this.state = {
      timer:null,
      positionY:0
    }
  }
  componentDidMount(){
    this.interval = setInterval(()=>{
      let y = this.state.positionY
      this.setState({
        positionY:++y
      })
    },600)
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  render() {
    return (
      <div className={style.load_wrapper}>
        <div className={style.load_img} style={{backgroundPositionY:-(this.state.positionY%7)*2.5+"rem"}}></div>
      </div>
    )
  }
}
