const EARTHRADIUS = 6370996.81;

export default [
  {
    name: '宝箱1号',
    longitude: 31.233 + Math.random() / 30,
    latitude: 121.491 + Math.random() / 30,
  }, {
    name: '宝箱2号',
    longitude: 31.233 + Math.random() / 20,
    latitude: 121.495 + Math.random() / 20,
  },  {
    name: '宝箱3号',
    longitude: 31.233 + Math.random() / 10,
    latitude: 121.497 + Math.random() / 10,
  }, {
    name: '宝箱河里',
    longitude: 31.243,
    latitude: 121.517,
  },
];

function degreeToRad(degree) {
  return Math.PI * degree/180;
}
function _getRange(v, a, b){
  if(a != null){
    v = Math.max(v, a);
  }
  if(b != null){
    v = Math.min(v, b);
  }
  return v;
}

function _getLoop(v, a, b){
  while( v > b){
    v -= b - a;
  }
  while(v < a){
    v += b - a;
  }
  return v;
}
export function getDistance(point1, point2){
  if(!(point1 instanceof BMap.Point) ||
      !(point2 instanceof BMap.Point)){
      return 0;
  }

  point1.lng = _getLoop(point1.lng, -180, 180);
  point1.lat = _getRange(point1.lat, -74, 74);
  point2.lng = _getLoop(point2.lng, -180, 180);
  point2.lat = _getRange(point2.lat, -74, 74);

  var x1, x2, y1, y2;
  x1 = degreeToRad(point1.lng);
  y1 = degreeToRad(point1.lat);
  x2 = degreeToRad(point2.lng);
  y2 = degreeToRad(point2.lat);

  return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
}

function randomPoint(lati, long, range) {
  const r = range / 111300;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  let x = w * Math.cos(t);
  const y = w * Math.sin(t);
  x = x / Math.cos(lati);
  return [lati + y, long + x];
}

export function generatePointsOld(latitude, longitude, range, count) {
  const points = [];
  for (let _noop = 0; _noop < count; _noop++) {
    const newPoint = randomPoint(latitude, longitude, range);
    points.push({
      longitude: newPoint[1],
      latitude: newPoint[0],
    });
  }
  return points;
}

export function generatePoints(walking, latitude, longitude, range, count, maxDistance = 50) {
  return new Promise((resolve, reject) => {
    const points = [];
    const startPoint = new BMap.Point(latitude, longitude);

    for (let _noop = 0; _noop < count; _noop++) {
      const newPoint = randomPoint(latitude, longitude, range);
      points.push({
        longitude: newPoint[1],
        latitude: newPoint[0],
      });
    }

    function spliceAndContinue(index) {
      points.splice(index, 1);
      if (!points[index]) return resolve(points);
      queryPoint(index);
    }

    function queryPoint(index) {

      const point = points[index];
      const endPoint = new BMap.Point(point.latitude, point.longitude);
      walking.search(startPoint, endPoint);
      walking.setSearchCompleteCallback((rs) => {
        const result = walking.getResults();
        if (!result) return spliceAndContinue(index);
        const plan = walking.getResults().getPlan(0);
        if (!plan) return spliceAndContinue(index);
        const route = plan.getRoute(0);
        if (!route) return spliceAndContinue(index);
        const chartData = route.getPath();
        const finalPoint = chartData[chartData.length - 1];
        const distance = getDistance(endPoint, finalPoint);
        if (distance > maxDistance) {
          return spliceAndContinue(index);
        }
        point.route = chartData; // set route
        var nextIndex = index + 1;
        if (nextIndex >= points.length) {
          // traverse completed
          resolve(points)
        } else queryPoint(nextIndex);
      });
    }
    queryPoint(0);

  })
}
