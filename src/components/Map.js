/*
  Declarative Baidu Map
*/

/* global BMap */

import React, { Component, PropTypes } from 'react';
import './Map.css';
const AK = 'eGgfhshrvZANxKGXHKfaGK3YBWcXOgYN';

export default class Map extends Component {

  state = {
    loaded: !!window.BMap,
  };

  static propTypes = {

  };

  static childContextTypes = {
    map: PropTypes.object,
  };

  getChildContext() {
    return { map: this.map }
  }

  componentDidMount() {
    // load and mount map
    if (!this.state.loaded) {
      window.mapOnLoad = this.loadBmap;
      const script = document.createElement("script");
      script.src = 'http://api.map.baidu.com/api?v=2.0&ak='
      + AK +
      '&callback=mapOnLoad';
      script.async = true;
      script.addEventListener('error', () => {
        this.setState({ loadError: true });
      }, false);
      document.body.appendChild(script);
    } else {
      this.initBmap();
    }
  }

  componentWillReceiveProps(nextProps) {
    // onClick event
    if (this.props.onClick !== nextProps.onClick) {
      if (this.props.onClick) {
        this.map.removeEventListener('click', this.props.onClick);
      }
      if (nextProps.onClick) {
        this.map.addEventListener('click', nextProps.onClick);
      }
    }
    if (this.props.route !== nextProps.route) {
      if (nextProps.route && nextProps.route.length > 1) {
        this.clearRoute();
        this.drawRoute(nextProps.route);
      } else {
        this.clearRoute();
      }
    }
  }

  loadBmap = () => {
    this.setState({
      loaded: true,
    }, () => {
      // after state is changed
      this.initBmap();
    });
    window.loadBmap = null; // release memory
  }

  initBmap = () => {
    this.map = new BMap.Map('mapHolder');
    this.map.centerAndZoom(new BMap.Point(121.491, 31.233), 11);
    window.daMap = this.map;
    this.setState({ mapLoaded: true }); // force context to be set
    const { onClick } = this.props;
    if (this.onClick) {
      this.map.addEventListener("click", onClick)
    }
    if (this.props.route && this.props.route.length > 1) {
      this.drawRoute(this.props.route);
    }
  }

  clearRoute() {
    if (this._route) {
      this.map.removeOverlay(this._route);
      this._route = null;
    }
  }

  drawRoute = (route) => {
    console.log('draw', route);
    const polyline = new BMap.Polyline(route,
      {strokeColor: 'red', strokeWeight: 6, strokeOpacity: 1}
    );
    console.log(polyline);
    this.map.addOverlay(polyline);
    this._route = polyline;
  }

  renderLoader() {
    return (<div className="map-container">
      <span className="map-status-text">载入中...</span>
    </div>);
  }

  renderLoadError() {
    return (<div className="map-container">
      <span className="map-status-text">载入出错</span>
    </div>);
  }

  render() {
    const { loaded, loadError } = this.state;
    const { children } = this.props;
    if (!loaded) {
      if (loadError) return this.renderLoadError();
      return this.renderLoader();
    }
    return (<div className="map-container">
      <div id="mapHolder" />
      <ul id="results"/>
      {children}
    </div>);
  }
}
