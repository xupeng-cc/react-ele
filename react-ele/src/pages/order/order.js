import React,{Component} from 'react'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'

class Order extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
      <div>
        <Header title="订单列表"/>

        订单页
        <Footer url={this.props.match.url}/>
      </div>
    )
  }
}

export default Order
