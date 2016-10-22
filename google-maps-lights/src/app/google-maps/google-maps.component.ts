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
  infoWindow;
  mapCenter = {lat: 43.778907, lng: 24.504756};
  intersectionLocations:Intersection[];
  directionsService;
  directionsDisplay;
  MarkerWithLabel;
  listaStrazi = 'Strada Mihail Kogălniceanu, Corabia\n' +
    'Strada Frații Golești, Corabia\n' +
    'Strada Caraiman, Corabia\n' +
    'Strada Câmpului, Corabia';
  // 'Strada Câmpului, Corabia\n' +
  // 'Strada Sabinelor, Corabia\n' +
  // 'Strada Decebal, Corabia';

  constructor(private semafoare:SemafoareService) {
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

    // this.placeMarkers();

    // this.calcRoute();

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

    this.infoWindow = new this.maps.InfoWindow(rendererOptions);
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
          // this.directionsDisplay.setDirections(response);
        } else {
          reject();
        }
      });
    });
  }

  // placeMarkers() {
  //   this.intersectionLocations = [
  //     {lat: -31.563910, lng: 147.154312, label: 'A'},
  //     {lat: -33.718234, lng: 150.363181, label: 'B'},
  //     {lat: -33.727111, lng: 150.371124, label: 'C'},
  //     {lat: -33.848588, lng: 151.209834, label: 'D'},
  //     {lat: -33.851702, lng: 151.216968, label: 'E'}
  //   ];
  //
  //   let markers = this.intersectionLocations.map((location, i) => {
  //     return new this.maps.Marker({
  //       position: location,
  //       label: location.label
  //     });
  //   });
  // }
  setDirections(start, end) {
    // if(this.intervalId){
    //   clearInterval(this.intervalId);
    // }
    return this.getRoute(start, end)
      .then((response) => {
        return this.semafoare.getSemafoare(response.routes[0].legs[0].steps).then((semaforList:any[]) => {
          console.log('semaforlist', semaforList);
          this.directionsDisplay.setDirections(response);


          var merkerList = semaforList.map((semafor) => {

            var icon = '/assets/img/trafficlight-green.png';
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
          console.log('merkerList', merkerList);
          const UPDATE_INTERVAL = 1000;


          setInterval(function () {
            for (var i = 0; i < merkerList.length; i++) {
              var m = merkerList[i];
              var semafor = m.semafor;
              if (semafor.nextChange <= UPDATE_INTERVAL) {
                semafor.isGreen = !semafor.isGreen;
                semafor.nextChange = semafor.timeInterval;
              } else {
                semafor.nextChange -= UPDATE_INTERVAL;
              }
              var icon = '/assets/img/trafficlight-green.png';
              if (!semafor.isGreen) {
                icon = '/assets/img/trafficlight-red.png';
              }

              m.marker.set("labelContent", "" + (semafor.nextChange / 1000));

              m.marker.set("icon", icon);
            }
          }, UPDATE_INTERVAL);


        })
      })
  }

  getIntersectionsList() {
    let listaStrazi = this.listaStrazi.split('\n');
    let routes = [];

    this._getPossibleRoutes(routes, listaStrazi, 0);

    let routePromises:Promise<RouteResponse>[] = routes.map(route => this.getRoute(route.start, route.end));

    Promise
      .all(routePromises)
      .then((results:RouteResponse[]) => {
        this._collectPoints(results);
      });
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
      // route.routes.
    });
  }

  // handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //     'Error: The Geolocation service failed.' :
  //     'Error: Your browser doesn\'t support geolocation.');
  // }
}
