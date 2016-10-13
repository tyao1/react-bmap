/* global BMap */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map';
import Marker from './components/Marker';
import Polyline from './components/Polyline';

import { data, generatePoints, getDistance, generatePointsOld } from './mock';

const icon = {
  src: 'https://ooo.0o0.ooo/2016/10/13/57ff2bd3bbc9f.png',
  size: [48, 48],
  offset: [24, 24],
  imageOffset: [0, 0],
}

class App extends Component {
  state = {
    route: null,
    latitude: 121.499 + Math.random() / 10,
    longitude: 31.234 + Math.random() / 10,
    points: [],
  };

  onMapLoadOld = () => {
    const now = performance.now();
    this.setState({points: generatePointsOld(this.state.latitude, this.state.longitude, 2000, 10)}, () => {
      console.log('total', performance.now() - now);
    });
  }
  onMapLoad = async () => { // 判断距离 生成20个
    const now = performance.now();
    const walking = new BMap.WalkingRoute(this.refs.map.map);
    let need = 10;
    while (need > 0) {
      const points = await generatePoints(walking, this.state.latitude, this.state.longitude, 2000, Math.min(need, 5));
      need -= points.length;
      this.setState({points: this.state.points.concat(points)});
    }
    console.log('total', performance.now() - now);
  }

  onMarkerClick = (longitude, latitude) => (evt) => {
    console.log('clicked marker');
    var walking = new BMap.WalkingRoute(this.refs.map.map);
    const endPoint = new BMap.Point(latitude, longitude);
    const startPoint = new BMap.Point(this.state.latitude, this.state.longitude);
    console.log(startPoint, endPoint);
    walking.search(startPoint, endPoint);
    walking.setSearchCompleteCallback((rs) => {
      console.log(walking.getResults());
      var chartData = walking.getResults().getPlan(0).getRoute(0).getPath();
      console.log(getDistance(chartData[chartData.length - 1], endPoint));
      this.setState({route: chartData});
    });
  }

  onMarkerClickNew = (index) => {
    return () => {
      requestAnimationFrame(() => {
        this.setState({route: this.state.points[index].route});
      });
    }
  }

  onMapClick = (evt) => {this.setState({route: null})}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Duojin Map</h2>
        </div>
        <Map
          ref="map"
          initialCenter={[this.state.latitude, this.state.longitude]}
          initialZoom={14}
          onClick={this.onMapClick}
          onLoad={this.onMapLoad}
        >
          {
            this.state.points.map((item, ind) => {
              return (
                <Marker
                  key={ind}
                  longitude={item.longitude}
                  latitude={item.latitude}
                  // icon={icon}
                  onClick={this.onMarkerClickNew(ind)}
                />
              )
            })
          }
          <Polyline points={this.state.route} />
        </Map>
      </div>
    );
  }
}

export default App;
