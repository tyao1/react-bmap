// Declarative Marker for Baidu Map
/* global BMap */

import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Marker extends Component {

  static propTypes = {
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.object
  }

  static contextTypes = {
    map: PropTypes.object,
  }


  componentDidMount() {
    // the marker is mounted for the first time
    if (this.context.map && !this.maker) {
      this.buildMarker(this.props, this.context);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.context.map && nextContext.map) {
      // the map is just initialized, init the marker
      this.buildMarker(nextProps, nextContext);
    } else if (this.marker) {
      // marker existed, do we need to update it?
      if (shallowCompare(nextProps)) {
        if (this.props.onClick) {
          this.marker.removeEventListener('click', this.props.onClick);
        }
        console.log('rebuild');
        this.buildMarker(nextProps, nextContext, true);
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.context.map.removeOverlay(this.marker);
  }

  buildMarker = (props, context, refresh) => {
    if (refresh) {
      context.map.removeOverlay(this.marker);
    }
    const point = new BMap.Point(props.latitude, props.longitude);

    if (props.icon) {
      const {src, size, offset, imageOffset} = props.icon;
      const myIcon = new BMap.Icon(src, new BMap.Size(size[0], size[1]), {
      // 指定定位位置。
      // 当标注显示在地图上时，其所指向的地理位置距离图标左上
      // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
         // 图标中央下端的尖角位置。
         offset: new BMap.Size(offset[0], offset[1]),
         // 设置图片偏移。
         // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
         // 需要指定大图的偏移位置，此做法与css sprites技术类似。
         imageOffset: new BMap.Size(imageOffset[0], imageOffset[1])   // 设置图片偏移
       });
       this.marker = new BMap.Marker(point, {icon: myIcon});
    } else {
      this.marker = new BMap.Marker(point);
    }
    context.map.addOverlay(this.marker);
    // debug
    // context.map.centerAndZoom(point, 15);
    if (props.onClick) {
      this.marker.addEventListener("click", props.onClick);
    }
  }

  render() {
    // console.log(this.props);
    // We don't need to render anything
    return null;
  }
}
