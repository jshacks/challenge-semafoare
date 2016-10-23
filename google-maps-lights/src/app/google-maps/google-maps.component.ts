declare var CustomMarkerFactory:any;
import {Component, AfterViewInit} from '@angular/core';
import {SemafoareService} from '../shared/semafoare/semafoare.service';
import * as googleMapsApi from 'google-maps-api';
import './markersFactory.js';
import {
  Intersection,
  RouteResponse
} from './index';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements AfterViewInit {
  startPoint = "Strada Frații Golești 78-80, Corabia 235300";
  endPoint = "Strada Mihail Kogălniceanu 101, Corabia 235300";
  map;
  maps;
  // infoWindow;
  mapCenter = {lat: 43.778907, lng: 24.504756};
  intersectionLocations:Intersection[];
  directionsService;
  directionsDisplay;
  MarkerWithLabel;
  trainingMarkers;
  listaStrazi = 'Strada Mihail Kogălniceanu, Corabia\n' +
    'Strada Frații Golești, Corabia\n' +
    'Strada Caraiman, Corabia\n' +
    'Strada Câmpului, Corabia\n' +
    'Strada Câmpului, Corabia\n' +
    'Strada Sabinelor, Corabia\n' +
    'Strada Portului, Corabia\n' +
    'Drumul Carierei, Corabia\n' +
    'Aleea Garii, Corabia\n' +
    'Strada Cezar Bolliac, Corabia\n' +
    'Strada General Tell, Corabia\n' +
    'Bulevardul 1 Mai, Corabia\n' +
    'Strada Lascăr Catargiu, Corabia\n' +
    'Strada Decebal, Corabia';

  constructor(private _semafoare:SemafoareService) {
  }

  ngAfterViewInit() {
    googleMapsApi('AIzaSyC6pWJudw8NzaDS_H7L2I3SOU9ISbNhJr4')().then(maps => {
      this.initMap(maps);
      this.MarkerWithLabel = CustomMarkerFactory(maps);
    });
  }

  initMap(maps) {
    this.maps = maps;

    this.directionsService = new this.maps.DirectionsService();

    this.createMap();

    // Try HTML5 geolocation.
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent('Location found.');
    //     map.setCenter(pos);
    //   }, function() {
    //     handleLocationError(true, infoWindow, map.getCenter());
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, infoWindow, map.getCenter());
    // }
  }

  createMap() {
    this.map = new this.maps.Map(document.getElementById('map'), {
      center: this.mapCenter,
      zoom: 16
    });

    let rendererOptions = {
      map: this.map
    };

    // this.infoWindow = new this.maps.InfoWindow(rendererOptions);
    this.directionsDisplay = new this.maps.DirectionsRenderer(rendererOptions)
  }

  getRoute(start, end):Promise<RouteResponse> {
    let request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };

    return new Promise((resolve, reject) => {
      this.directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject([response, status]);
        }
      });
    });
  }

  placeMarkers(pointsArr) {
    this.intersectionLocations = pointsArr.map((point, idx) => {
      return Object.assign(point, {label: idx + ''});
    });

    let intersectionMeta = this.intersectionLocations.map(intersection => {
      let northSouth = Math.random() > 0.5,
        minTime = 10,
        maxTime = 20;

      return {
        id: +intersection.label,
        name: intersection.label,
        lat: intersection.lat,
        lng: intersection.lng,
        northSouth: northSouth,
        eastWest: !northSouth,
        timeInterval: this._getRandomInt(minTime, maxTime) * 1000,
        nextChange: Math.round(Math.random() * minTime * 1000)
      }
    });

    console.log(JSON.stringify(intersectionMeta, null, 4));

    this.trainingMarkers = pointsArr.map((location, i) => {
      return new this.maps.Marker({
        position: location,
        label: location.label,
        map: this.map
      });
    });

    // let markerCluster = new MarkerClusterer(this.map, markers,
    //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  }

  setDirections(start, end) {
    this._deleteTrainingMarkers();

    return this
      .getRoute(start, end)
      .then(response => {
          return this._semafoare.getSemafoare(response.routes[0].legs[0].steps).then((semaforList:any[]) => {
            // console.log('semaforlist', semaforList);
            this.directionsDisplay.setDirections(response);

            let merkerList = semaforList.map(semafor => {
              let icon = '/assets/img/trafficlight-green.png';
              if (!semafor.isGreen) {
                icon = '/assets/img/trafficlight-red.png';
              }

              return {
                semafor,
                marker: new this.MarkerWithLabel({
                  position: {lat: parseFloat(semafor.lat), lng: parseFloat(semafor.lng)},
                  map: this.map,
                  labelContent: "" + (semafor.nextChange / 1000),
                  labelAnchor: this.maps.Point(3, 30),
                  labelClass: "SemaforTimer", // the CSS class for the label
                  labelInBackground: false,
                  icon: icon,
                  width: '10px',
                  height: '10px'
                })
              }
            });
            // console.log('merkerList', merkerList);
            const UPDATE_INTERVAL = 1000;

            setInterval(() => {
              for (let i = 0; i < merkerList.length; i++) {
                let m = merkerList[i];
                let semafor = m.semafor;

                if (semafor.nextChange <= UPDATE_INTERVAL) {
                  semafor.isGreen = !semafor.isGreen;
                  semafor.nextChange = semafor.timeInterval;
                } else {
                  semafor.nextChange -= UPDATE_INTERVAL;
                }

                let icon = '/assets/img/trafficlight-green.png';
                if (!semafor.isGreen) {
                  icon = '/assets/img/trafficlight-red.png';
                }

                m.marker.set("labelContent", "" + (semafor.nextChange / 1000));
                m.marker.set("icon", icon);
              }
            }, UPDATE_INTERVAL);
          });
        },
        error => {
          console.error(error);
        });
  }

  getIntersectionsList() {
    let listaStrazi = this.listaStrazi.split('\n'),
      routes = [];

    this._getPossibleRoutes(routes, listaStrazi, 0);

    let results = [];
    console.log(routes.length);
    this._queuePromises(routes, results, 0);
  }

  private _deleteTrainingMarkers() {
    if (this.trainingMarkers && this.trainingMarkers.length) {
      for (let i = 0; i < this.trainingMarkers.length; i++) {
        this.trainingMarkers[i].setMap(null);
      }
      this.trainingMarkers = [];
    }
  }

  private _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private _queuePromises(routes, results, idx) {
    let queryLimit = 2,
      timeLimit = 2000,
      routePromises:Promise<RouteResponse>[] = routes
        .slice(idx * queryLimit, (idx + 1) * queryLimit)
        .map(route => this.getRoute(route.start, route.end));

    setTimeout(() => {
      Promise
        .all(routePromises)
        .then(res => {
          console.log(idx);
          results.push(...res);

          if (results.length === routes.length) {
            this._collectPoints(results);
          } else {
            this._queuePromises(routes, results, idx + 1);
          }
        });
    }, timeLimit);
  }

  private _getPossibleRoutes(routesArr:any[], pointsArr:any[], idx:number) {
    if (idx === pointsArr.length - 1) {
      return;
    }

    for (let i = idx + 1, len = pointsArr.length; i < len; i++) {
      routesArr.push({start: pointsArr[idx], end: pointsArr[i]});
    }

    this._getPossibleRoutes(routesArr, pointsArr, idx + 1);
  }

  private _collectPoints(routes:RouteResponse[]) {
    let points = [];

    routes.forEach(route => {
      route.routes[0].legs[0].steps.forEach(step => {
        let startLocationPoint = {
          lat: step.start_location.lat(),
          lng: step.start_location.lng()
        };
        let endLocationPoint = {
          lat: step.end_location.lat(),
          lng: step.end_location.lng()
        };

        this._includeInPointArr(points, startLocationPoint, endLocationPoint);
      });
    });

    this.placeMarkers(points);
  }

  private _includeInPointArr(pointArr, ...points) {
    points.forEach(point => {
      if (!this._isPointInArr(pointArr, point)) {
        pointArr.push(point);
      }
    });
  }

  private _isPointInArr(pointArr, point) {
    return pointArr.some(pt => pt.lat === point.lat && pt.lng === point.lng);
  }

  // handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //     'Error: The Geolocation service failed.' :
  //     'Error: Your browser doesn\'t support geolocation.');
  // }
}
