import React,{Component} from 'react'
import {Link} from "react-router-dom"
import './footer.scss'
import '../../assets/iconfont/iconfont'

export default class Footer extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentUrl:this.props.url || ""
    }
  }
  componentDidMount(){
   
  }
  render(){
    let obj = {pathname:"/msite",search:"?geohash=40.099301,116.275113",query:{a:1},state:{b:1212}}
    return (
      <section className='footer-container'>
        <Link className={`guide-item ${this.state.currentUrl==='/msite'?'active':''}`} to={obj}>
          <div className='icon-changyonglogo40 icon-style'></div>
          <span className='spec-text'>外卖</span>
        </Link>
        <Link className={`guide-item ${this.state.currentUrl==='/search'?'active':''}`} to='/search'>
          <div className='icon-zhinanzhen icon-style'></div>
          <span>搜索</span>
        </Link>
        <Link className={`guide-item ${this.state.currentUrl==='/order'?'active':''}`} to='/order'>
          <div className='icon-dingdan icon-style'></div>
          <span>订单</span>
        </Link>
        <Link className={`guide-item ${this.state.currentUrl==='/profile'?'active':''}`} to='/profile'>
          <div className='icon-account icon-style'></div>
          <span>我的</span>
        </Link>
      </section>
    )
  }
}