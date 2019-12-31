import React,{Component} from 'react'
import './header.scss'

export default class Head extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidMount(){

  }
  render(){
    return (
      <header className="head_top">
        { this.props.goBack && <span className="icon-back headerBack" onClick={()=>this.props.goBack()}></span> }
        <span className="headerTitle">{this.props.title}</span>
      </header>
    )
  }
}
