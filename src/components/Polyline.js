// Declarative Marker for Baidu Map
/* global BMap */

import React, { Component, PropTypes } from 'react';
// import shallowCompare from 'react-addons-shallow-compare';

export default class Polyline extends Component {

  static propTypes = {
    points: PropTypes.array,
    onClick: PropTypes.func,
  }

  static contextTypes = {
    map: PropTypes.object,
  }

  /*
  componentDidMount() {
    // the marker is mounted for the first time
    console.log('map from context', this.context.map);
  }
  */

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.context.map && nextContext.map) {
      // the map is just initialized, init the marker
      this.buildMarker(nextProps, nextContext);
    } else {
      // if (shallowCompare(nextProps)) {
        if (this.props.onClick) {
          this.polyline.removeEventListener('click', this.props.onClick);
        }
        this.buildMarker(nextProps, nextContext, true);
      // }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.context.map.removeOverlay(this.polyline);
  }

  buildMarker = (props, context, refresh) => {
    if (refresh) {
      context.map.removeOverlay(this.polyline);
    }
    // console.log('pts', props.points);
    if (!props.points || props.points.length < 2) {
      return;
    }
    this.polyline = new BMap.Polyline(props.points,
      {
        strokeColor: props.strokeColor,
        strokeWeight: props.strokeWeight,
        strokeOpacity: props.strokeOpacity,
      }
    );
    context.map.addOverlay(this.polyline);
    // debug
    if (props.onClick) {
      this.polyline.addEventListener('click', props.onClick);
    }
  }

  render() {
    // We don't need to render anything
    return null;
  }
}
