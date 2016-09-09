// Declarative Marker for Baidu Map
/* global BMap */

import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Marker extends Component {

  static propTypes = {
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
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
    } else if (this.marker) {
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
    this.marker = new BMap.Marker(point);
    context.map.addOverlay(this.marker);
    // debug
    // context.map.centerAndZoom(point, 15);
    if (props.onClick) {
      this.marker.addEventListener("click", props.onClick);
    }
  }

  render() {
    // We don't need to render anything
    return null;
  }
}
