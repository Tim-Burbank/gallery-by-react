require('normalize.css');
require('../styles/App.css');


import React from 'react';
import ReactDOM from 'react-dom';


let imageDatas = require('json!../data/imageDatas.json');

//将图片名转成URL路径
 imageDatas = (function genImageURL(imageDatasArr){
  for(let i =0,j=imageDatasArr.length;i<j;i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass ({
  handleClick : function(e){

  if(this.props.arrange.isCenter) {
    this.props.inverse();
  }else{
    this.props.center()
}

    e.stopPropagation();
    e.preventDefault();
  },
  render: function () {
    var styleObj = {};

    /*{如果props属性中指定了这图片位置 则使用}*/
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    /*{如果图片旋转角度有值并且不为0 添加旋转角度}*/
    if(this.props.arrange.rotate){
      (['Moz','Ms','Webkit','']).forEach(function(value){
        styleObj[value+'Transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    var imgFigureClassName='img-figure';
    imgFigureClassName += this.props.arrange.isInverse? ' is-inverse':'';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
});
//获取区间内的随机值


/*var ImgFigure = React.createClass({
  render:function(){

    var styleObj = {};
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }
    return(
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL}
              alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});*/

export default class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [],
      Constant: {
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: {
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {
          x: [0, 0],
          topY: [0, 0]
        }
      },
      rotate: 0,
      isInverse: false,
      isCenter: false
    };
  }
  /*
   * 翻转图片
   * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */

  inverse(index){
    return function(){
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this)
  }
  rearrange(centerIndex){
    function getRangeRandom(low,high){
      return Math.ceil(Math.random() * (high - low) + low)
    }

    function get30DegRandom(){
      return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
    }
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.state.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random()*2),
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //居中centerIndex的图片
    imgsArrangeCenterArr[0] = {
      pos : centerPos,
      rotate : 0,
      isCenter: true
    };
    //取出要布局上册的图片信息
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局上册图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index] = {
        pos : {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    for(var i = 0, j = imgsArrangeArr.length, k = j / 2;i < j;i++){
      var hPosRangeLORX = null ;
      //前半部分布局左边，后半部分布局有变
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos : {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr : imgsArrangeArr
    })
  }

  center(index){
    return function(){
      this.rearrange(index)
    }.bind(this)
  }

  componentDidMount(){
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.clientWidth,
      stageH = stageDOM.clientHeight,
      halfStageW = Math.floor(stageW/2),
      halfStageH = Math.floor(stageH/2);
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW/2),
      halfImgH = Math.floor(imgH/2);

    this.state.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };

    this.state.Constant.hPosRange.leftSecX = [0 - halfImgW,
     halfStageW - halfImgW * 3];
    this.state.Constant.hPosRange.rightSecX =[halfStageW + halfImgW, stageW - halfImgW];
    this.state.Constant.hPosRange.y =[0 - halfImgH, stageH - halfImgH];

    this.state.Constant.vPosRange.topY = [0 - halfImgH,
     halfStageH - halfImgH * 3];
    this.state.Constant.vPosRange.x = [halfStageW - imgW,
    halfStageW];

    this.rearrange(0);
  }

  render() {
    let controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach(function(value,index){
      if(! this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}/>)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

export default  AppComponent
