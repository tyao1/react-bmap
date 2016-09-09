/* global BMap */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map';
import Marker from './components/Marker';
import Polyline from './components/Polyline';

import data from './mock';

class App extends Component {
  state = {
    route: null,
    latitude: 121.499,
    longitude: 31.234,
  };


  onMarkerClick = (longitude, latitude) => (evt) => {
    console.log('clicked marker');
    var walking = new BMap.WalkingRoute(this.refs.map.map, {
     renderOptions: {
       // map: this.refs.map.map,
       // panel : "results",
       // autoViewport: true,
     }
    });
    const startPoint = new BMap.Point(latitude, longitude);
    const endPoint = new BMap.Point(this.state.latitude, this.state.longitude);
    console.log(startPoint, endPoint);
    walking.search(startPoint, endPoint);
    walking.setSearchCompleteCallback((rs) => {
      var chartData = walking.getResults().getPlan(0).getRoute(0).getPath();
      console.log(chartData);
      this.setState({route: chartData});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Duojin Map</h2>
        </div>
        <Map
          ref="map"
          onClick={(evt) => {this.setState({route: null})}}
          // route={this.state.route}
        >
          {
            data.map(item => {
              return (
                <Marker
                  key={item.name}
                  longitude={item.longitude}
                  latitude={item.latitude}
                  onClick={this.onMarkerClick(item.longitude, item.latitude)}
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
