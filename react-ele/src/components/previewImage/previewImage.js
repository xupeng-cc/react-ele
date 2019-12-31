//图片放大组件
import React, { Component } from 'react';
import style from './previewImage.module.scss';
import BScroll from 'better-scroll';

class previewImage extends Component {
  goBack(){
    this.props.history.goBack();
  }
  componentDidMount(){
    let slide = new BScroll("#preview_img_list",{
      scrollX:true,
      scrollY:false,
      click:true,
      bounce:{
        left:false,
        right:false
      },
      snap:{
        loop:false,
        threshold:0.1,
        speed:400
      }
    })
    //跳转至当前图片
    let {imgPath,imgPathList=[imgPath]} = this.props.location.query;
    let imgPathIndex = imgPathList.findIndex(item=>item === imgPath)
    slide.goToPage(imgPathIndex);

    this.setSlideWidth();
  }
  //设置宽度
  setSlideWidth(){
    let childs = this.refs.previewImgs.children;
    let width = 0;
    let sliderWidth = window.screen.width;
    for (let i = 0; i < childs.length; i++) {
      let child = childs[i];
      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    this.refs.previewImgs.style.width = width+"px";
  }
  render() {
    let {imgPath,imgPathList=[imgPath]} = this.props.location.query;
    return (
      <div className={style.license_container} onClick={()=>{this.goBack()}}>
        <div className={style.preview_img_list} id="preview_img_list">
          <div className={style.preview_img_content} ref="previewImgs">
            {imgPathList.map(path=>(
              <img key={path} src={path} alt=""/>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default previewImage;
