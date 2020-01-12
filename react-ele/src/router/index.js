import React,{Component} from 'react'
import {HashRouter,Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import profile from '../pages/profile/profile'
import forget from '../pages/forget/forget'
import blance from '../pages/blance/blance'
import points from '../pages/points/points'
import benefit from '../pages/benefit/benefit'


import login from '../pages/login/login'
import order from '../pages/order/order'
import msite from '../pages/msite/msite'
import food from '../pages/food/food'
import shop from '../pages/shop/shop'
import orderConfirm from '../pages/orderConfirm/orderConfirm'
import search from '../pages/search/search'

//auth字段用来判断是否需要登录才可以访问
const Routers = [
  {path:"/",component:profile,exact:true},
  {path:"/profile",component:profile},
  {path:"/blance",component:blance},
  {path:"/points",component:points},
  {path:"/benefit",component:benefit},
  {path:"/forget",component:forget},
  {path:"/login",component:login},
  {path:"/order",component:order,auth:true},
  {path:"/msite",component:msite},
  {path:"/food",component:food},
  {path:"/shop/:id",component:shop},
  {path:"/orderConfirm",component:orderConfirm,auth:true},
  {path:"/search",component:search}
]

class RouterConfig extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    // let token = this.props.user_id;
    let token = localStorage.getItem("user_id");
    return (
      <HashRouter>
        <Switch>
          {Routers.map((item,index)=>{
            return <Route exact={item.exact} path={item.path} key={index} render={
              props => !item.auth?(<item.component {...props}/>):( token?<item.component {...props}/>:<Redirect to={{
                pathname:"/login",
                state:{redirect:props.location}
              }} /> )
            }/>
          })}
        </Switch>
      </HashRouter>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    user_id:""
  }
}

export default connect(mapStateToProps)(RouterConfig);