import React, { Component } from 'react'
import style from './food.module.scss'
import {Prompt} from 'react-router-dom'
import Header from '../../components/header/header'
import Icon from '../../components/incon/icon'
import ShopList from '../shopList/shopList'

import { getFoodCategory,getDelivery,getBusinessAttr } from '../../service/apis'
import { getUrlParams } from '../../config/utils'

class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headTitle: "",   //url传过来的title
      sortBy: "",      //筛选类型(排序、筛选还是分类)
      categoryList: [], //商家分类列表
      categoryActiveIndex: 0,  //选中的一级分类项下标
      secondCategoryIndex:0,   //选中的二级分类下标
      delivery:[],            //配送方式
      businessAttr:[],        //商家属性
      delivery_mode:"",      //选中的配送方式（单选）
      support_ids:[],       //选中的商家属性（多选）
      typeImgBaseUrl: "https://fuss10.elemecdn.com/",
      geohash:"",
      restaurantId:"",   //选中的一级分类id
      restaurant_category_ids:"",  //选中的二级分类id
      orderBy:""    //选择的排序项
    }
  }
  goBack = () => {
    this.props.history.goBack();
  }
  //切换筛选条件
  chooseType(type, e) {
    console.log(type)
    e.stopPropagation();
    let _type = type === this.state.sortBy ? "" : type
    this.setState({
      sortBy: _type
    })
  }
  //获取各种分类列表
  getCategory = async () => {
    //商家分类
    let foodCategory = await getFoodCategory({ latitude: "40.099301", longitude: "116.275113" });
    let _index = foodCategory.findIndex(item=>{
      return item.id == this.state.restaurantId
    })
    //配送方式
    let delivery = await getDelivery({ latitude: "40.099301", longitude: "116.275113" })
    //商家属性
    let businessAttr = await getBusinessAttr({latitude: "40.099301", longitude: "116.275113"})
    this.setState({
      categoryList: foodCategory,
      categoryActiveIndex:_index,
      delivery,
      businessAttr
    })
  }
  //点击一级分类
  chooseFirstLevl = (index, e) => {
    e.stopPropagation();
    this.setState({
      categoryActiveIndex: index
    })
  }
  //点击二级分类
  chooseSecondLevel = (index,e)=>{
    e.stopPropagation();
    console.log(index)
    let {categoryList,categoryActiveIndex} = this.state;
    let current = categoryList[categoryActiveIndex].sub_categories[index];
    this.setState({
      headTitle:current.name,
      restaurantId:categoryList[categoryActiveIndex].id ,
      restaurant_category_ids:current.id,
      sortBy:""
    })
  }
  //点击排序列表
  chooseSortItem = (sortid,e)=>{
    e.stopPropagation();
    this.setState({
      orderBy:sortid,
      sortBy:""
    })
  }
  //筛选的条件（子组件传递的）
  filterCondition = (delivery_mode,support_ids)=>{
    this.setState({
      delivery_mode,
      support_ids,
      sortBy:""
    })
  }
  componentDidMount() {
    let params=getUrlParams(this.props.history.location.search)
    this.setState({
      headTitle:params.title,
      geohash:params.geohash,
      restaurantId:params.restaurantId
    })
    this.getCategory();
  }
  render() {
    console.log("render food")
    return (
      <div>
        <Header title={this.state.headTitle} goBack={this.goBack}></Header>
        <section className={style.foodWrapper}>
          <header className={style.food_sort}>
            <div className={[style.food_sort_item, this.state.sortBy === 'food' ? style.active : ''].join(" ")}>
              <div className={style.food_sort_item_container} onClick={(e) => this.chooseType("food", e)}>
                <span className={style.category_title}>{this.state.sortBy === 'food'?"分类":this.state.headTitle}</span>
                <span className={style.food_sort_icon}>
                  <Icon iconName="lower_triangle" fill={this.state.sortBy === 'food' ? "#3190e8" : "#666"} iconStyle={{ "verticalAlign": "middle" }}></Icon>
                </span>
              </div>
              {/* 下拉框 */}
              {this.state.sortBy === 'food' && <Category parent={this} 
              typeImgBaseUrl={this.state.typeImgBaseUrl} 
              categoryList={this.state.categoryList} 
              categoryActiveIndex={this.state.categoryActiveIndex}
              restaurant_category_ids={this.state.restaurant_category_ids}
              ></Category>}

            </div>
            <div className={[style.food_sort_item, this.state.sortBy === 'sort' ? style.active : ''].join(" ")}>
              <div className={style.food_sort_item_container} onClick={(e) => this.chooseType("sort",e)}>
                <span className={style.category_title}>排序</span>
                <span className={style.food_sort_icon}>
                  <Icon iconName="lower_triangle" fill={this.state.sortBy === 'sort' ? "#3190e8" : "#666"} iconStyle={{ "verticalAlign": "middle" }}></Icon>
                </span>
              </div>
              <section>
                {this.state.sortBy==='sort' && <Sort parent={this} orderBy={this.state.orderBy}></Sort>}
              </section>
            </div>
            <div className={[style.food_sort_item, this.state.sortBy === 'activity' ? style.active : ''].join(" ")}>
              <div className={style.food_sort_item_container} onClick={(e) => this.chooseType("activity",e)}>
                <span className={style.category_title}>筛选</span>
                <span className={style.food_sort_icon}>
                  <Icon iconName="lower_triangle" fill={this.state.sortBy === 'activity' ? "#3190e8" : "#666"} iconStyle={{ "verticalAlign": "middle" }}></Icon>
                </span>
              </div>
              <section>
                { this.state.sortBy === 'activity' && 
                  <Filter 
                    parent={this} 
                    delivery={this.state.delivery} 
                    businessAttr={this.state.businessAttr}
                    delivery_mode={this.state.delivery_mode}
                    support_ids={this.state.support_ids}
                  ></Filter>
                }
              </section>
            </div>
          </header>
        </section>

        {this.state.sortBy && <div className={style.hover}></div>}

        {/* 店铺列表 */}
        {this.state.geohash && <ShopList 
          geohash={this.state.geohash} 
          restaurantId={this.state.restaurantId} 
          restaurant_category_ids={this.state.restaurant_category_ids}
          orderBy={this.state.orderBy}
          delivery_mode={this.state.delivery_mode}
          support_ids={this.state.support_ids}
        ></ShopList>}
        
        {/* <Prompt message="你确定离开当前页面吗?" /> */}
      </div>
    )
  }
}
//店铺类别组件
function Category({categoryList,categoryActiveIndex,typeImgBaseUrl,parent,restaurant_category_ids}) {
  return (
    <section className={[style.optionBox,style.category_container].join(" ")}>
      <ul className={style.category_container_left}>
        {categoryList.map((item, index) => (
          <li className={style.category_sub} style={{ backgroundColor: index === categoryActiveIndex ? '#fff' : '#f1f1f1' }} key={index} onClick={(e) => { parent.chooseFirstLevl(index, e) }}>
            <div className={style.category_sub_left}>
              <img src={typeImgBaseUrl + item.image_url} alt="" />
              <span>{item.name}</span>
            </div>
            <div className={style.category_sub_right}>
              <span className={style.category_count}>{item.count}</span>
              <Icon iconName="right" fill="#ccc" iconStyle={{ width: '0.7rem', height: '0.7rem' }}></Icon>
            </div>
          </li>
        ))}
      </ul>
      <ul className={style.category_container_right}>
        {categoryList.length && categoryList[categoryActiveIndex].sub_categories.map((item, index) => (
          <li className={[style.category_detail_item,item.id==restaurant_category_ids?style.category_detail_item_active:""].join(" ")} key={index} onClick={(e)=>parent.chooseSecondLevel(index,e)}>
            <span>{item.name}</span>
            <span>{item.count}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
//排序组件
function Sort({parent,orderBy}){
  let sortList = [
    {"text":"智能排序","id":"0","iconName":"switch","iconColor":"#3B87C8"},
    {"text":"距离最近","id":"5","iconName":"location","iconColor":"#2A9BD3"},
    {"text":"销量最高","id":"6","iconName":"hot","iconColor":"#F07373"},
    {"text":"起送价最低","id":"1","iconName":"price","iconColor":"#E6B61A"},
    {"text":"配送速度最快","id":"2","iconName":"time","iconColor":"#37C7B7"},
    {"text":"评分最高","id":"3","iconName":"rate","iconColor":"#EBA53B"},
  ]
  return (
    <ul className={[style.optionBox,style.sortList].join(" ")}>
      {sortList.map(item=>(
        <li className={style.sortItem} key={item.id} onClick={(e)=>parent.chooseSortItem(item.id,e)}>
          <Icon iconName={item.iconName} fill={item.iconColor} iconStyle={{ width: '0.7rem', height: '0.7rem',margin:"0 0.3rem 0 0.8rem" }}></Icon>
          <p className={item.id==orderBy?style.sortActive:""}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

//筛选下拉
class Filter extends Component{
  constructor(props){
    super(props);
    this.state = {
      delivery_mode:"",   //配送方式（单选）
      support_ids:[]      //商家属性（多选）
    }
  }
  //点击配送方式
  selectDelivery = (item)=>{
    let _id = item.id;
    _id = this.state.delivery_mode==_id?"":_id
    this.setState({
      delivery_mode:_id
    })
  }
  //点击商家属性
  selectSupportId = (item)=>{
    let support_ids = this.state.support_ids;
    let _index = support_ids.findIndex(i=>i==item.id)
    if( _index>-1 ){
      support_ids.splice(_index,1);
    }else{
      support_ids.push(item.id);
    }
    this.setState({
      support_ids
    })
  }
  //点击清除
  clearSelect =()=>{
    this.setState({
      delivery_mode:"",
      support_ids:[]   
    })
  }
  //点击确定(选中的过滤项传递给父组件))
  confirmSelect =()=>{
    let {delivery_mode,support_ids} = this.state;
    this.props.parent.filterCondition(delivery_mode,support_ids)
  }
  componentDidMount(){
    let {delivery_mode,support_ids} = this.props;
    this.setState({
      delivery_mode,
      support_ids:[...support_ids]
    })
  }
  render(){
    let {support_ids,delivery_mode} = this.state;
    return (
      <div className={[style.optionBox,style.filterList].join(" ")}>
        <div className={style.delivery}>
          <p className={style.title}>配送方式</p>
          <ul className={style.filter_ul}>
            {this.props.delivery.map((item,index)=>(
              <li className={style.filter_li} key={index} style={{color:delivery_mode==item.id?"#3190e8":"#333"}} onClick={()=>this.selectDelivery(item)}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className={style.businessAttr}>
          <p className={style.title}>商家属性（可以多选）</p>
          <ul className={style.filter_ul}>
            {this.props.businessAttr.map((item,index)=>(
              <li className={style.filter_li} key={index} onClick={()=>this.selectSupportId(item)}>
                { 
                  support_ids.some(i=>i==item.id)?
                  (<Icon iconName="activity" fill="#3190e8" iconStyle={{width:"0.8rem",height:"0.8rem",marginRight:"0.25rem"}}></Icon>):
                  (<span className={style.filter_li_icon} style={{color:"#"+item.icon_color,borderColor:'#'+item.icon_color}}>{item.icon_name}</span> ) 
                }
                <span style={{color:support_ids.some(i=>i==item.id)?"#3190e8":"#333"}}>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={[style.btnBox,"clear"].join(" ")}>
          <button className={style.clear} onClick={()=>this.clearSelect()}>清空</button>
          <button className={style.confirm} onClick={()=>this.confirmSelect()}>确定</button>
        </div>
      </div>
    )
  }
}

export default Food;
