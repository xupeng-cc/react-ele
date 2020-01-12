import React, { Component,Fragment } from 'react';
import style from './search.module.scss';
import Header from '../../components/header/header'
import {getShopFromKey} from '../../service/apis'
import {imgBaseUrl} from "../../config/utils"
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import * as user from "../../store/action-type"
import Icon from '../../components/incon/icon'

class Search extends Component {
  constructor(props){
    super(props);
    this.state={
      keyword:"",
      list:null
    }
  }
  goBack(){
    this.props.history.goBack();
  }
  handleChange(e){
    let val = e.target.value;
    this.setState({
      keyword:val
    })
  }
  async searchShop(e){
    e.preventDefault();
    let keyword = this.state.keyword;
    if(!keyword){
      return false;
    }
    this.props.save_history_search({keyword})
    let result = await getShopFromKey({keyword,geohash:"40.09942,116.274524"});
    this.setState({list:result})
  }
  render() {
    let {list,keyword} = this.state;
    let historySearch = this.props.historySearch;
    return (
      <div>
        <Header title="搜索" goBack={()=>this.goBack()}></Header>
        <div className={style.search_wrapper}>
          <form action="" className={style.formContain}>
            <input type="text" placeholder="请输入商家或美食名称" maxLength="15" value={this.state.keyword} onChange={(e)=>this.handleChange(e)}/>
            <button onClick={(e)=>this.searchShop(e)}>提交</button>
          </form>
          <section>
            {list && (
                <SearchUl list={list}></SearchUl>
              )
            }
            
            {!keyword && (
              <SearchHistoryCom historySearch={historySearch} parent={this}></SearchHistoryCom>
            )}
          </section>
        </div>
      </div>
    )
  }
}


function SearchUl({list}){
  if(list.length<1){
    return (
      <div className={style.noResult}>很抱歉！无搜索结果</div>
    )
  }
  return (
    <div>
      <h1 className={style.searchResult_title}>商家</h1>
      <ul className={style.list_container}>
        {list.map(shop=>(
          <Link to={"/shop/"+shop.id} key={shop.id}>
            <li className={style.list_li}>
              <img src={imgBaseUrl+shop.image_path} alt="" className={style.list_li_left}/>
              <div className={style.list_li_right}>
                <p>{shop.name}</p>
                <p>月售{shop.recent_order_num}单</p>
                <p>{shop.float_minimum_order_amount}元起送/距离{shop.distance}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

function SearchHistoryCom({historySearch,parent}){
  if(!historySearch.length){
    return null;
  }
  return (
    <div>
      <h1 className={style.searchResult_title}>搜索历史</h1>
      <ul className={style.history_list}>
        {historySearch.map(search=>(
          <li className={style.history_li} key={search}>
            <span>{search}</span>
            <div onClick={()=>parent.props.delete_history_search({keyword:search})}>
              <Icon iconName="delete" fill="rgb(153, 153, 153)" iconStyle={{width:"1rem",height:"1rem"}}></Icon>
            </div>
          </li>
        ))}
      </ul>
      <div className={style.clearHistory} onClick={()=>parent.props.empty_history_search()}>清空历史记录</div>
    </div>
  )
}


const mapStateToProps = state=>{
  return {
    historySearch:state.historySearch
  }
}
const mapDispatchToProps = dispatch=>{
  return {
    save_history_search:(info)=>dispatch({type:user.SAVE_HISTORY_SEARCH,payload:info}),
    empty_history_search:()=>dispatch({type:user.EMPTY_HISTORY_SEARCH}),
    delete_history_search:(info)=>dispatch({type:user.DELETE_HISTORY_SEARCH,payload:info})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Search);