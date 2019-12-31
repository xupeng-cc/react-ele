import React, { Component } from 'react'
import style from './star.module.scss'
import Icon from '../incon/icon'
export default class star extends Component {
  constructor(props){
    super(props);
    this.state = {
      rate:Number(this.props.rate),
      starList:[1,2,3,4,5]
    }
  }
  render() {
    return (
      <div className={style.starWrapper}>
        <section className={style.starContainer}>
          {this.state.starList.map(item=>(
            <Icon fill="#d1d1d1" iconName="star" key={item}></Icon>
          ))}
        </section>
        <section className={[style.starContainer,style.starOverflow].join(" ")} style={{width:this.state.rate/5*2.5+'rem'}}>
          {this.state.starList.map(item=>(
            <Icon fill="#ff9a0d" iconName="star" key={item}></Icon>
          ))}
        </section>
      </div>
    )
  }
}
