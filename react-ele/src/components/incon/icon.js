import React, { Component } from 'react'
import style from './icon.module.scss'
export default class Icon extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render() {
    let {fill,iconName,iconStyle,iconClass} = this.props;
    return (
      <svg className={[style.iconClass,iconClass].join(" ")} style={iconStyle}>
        <use xlinkHref={"#icon-"+iconName} fill={fill}></use>
      </svg>
    )
  }
}
