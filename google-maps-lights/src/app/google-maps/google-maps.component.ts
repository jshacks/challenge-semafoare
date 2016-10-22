import {Component, AfterViewInit} from '@angular/core';

import * as googleMapsApi from 'google-maps-api';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements AfterViewInit {
  map;
  maps;
  infoWindow;
  mapCenter = {lat: -34.397, lng: 150.644};
  intersectionLocations = [];
  directionsService;
  directionsDisplay;

  constructor() {
  }

  ngAfterViewInit() {
    googleMapsApi('AIzaSyC6pWJudw8NzaDS_H7L2I3SOU9ISbNhJr4')().then(maps => this.initMap(maps));
  }

  initMap(maps) {
    this.maps = maps;

    this.directionsService = new this.maps.DirectionsService();

    this.createMap();

    // this.placeMarkers();

    this.calcRoute();

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
      zoom: 6
    });

    let rendererOptions = {
      map: this.map
    };

    this.infoWindow = new this.maps.InfoWindow(rendererOptions);
    this.directionsDisplay = new this.maps.DirectionsRenderer(rendererOptions)
  }

  calcRoute() {
    let start = 'Strada Postavarului, Bucuresti';
    let end = 'Piata Unirii, Bucuresti';
    let request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };

    this.directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      }
    });
  }

  placeMarkers() {
    this.intersectionLocations = [
      {lat: -31.563910, lng: 147.154312},
      {lat: -33.718234, lng: 150.363181},
      {lat: -33.727111, lng: 150.371124},
      {lat: -33.848588, lng: 151.209834},
      {lat: -33.851702, lng: 151.216968},
      {lat: -34.671264, lng: 150.863657},
      {lat: -35.304724, lng: 148.662905},
      {lat: -36.817685, lng: 175.699196},
      {lat: -36.828611, lng: 175.790222},
      {lat: -37.750000, lng: 145.116667},
      {lat: -37.759859, lng: 145.128708},
      {lat: -37.765015, lng: 145.133858},
      {lat: -37.770104, lng: 145.143299},
      {lat: -37.773700, lng: 145.145187},
      {lat: -37.774785, lng: 145.137978},
      {lat: -37.819616, lng: 144.968119},
      {lat: -38.330766, lng: 144.695692},
      {lat: -39.927193, lng: 175.053218},
      {lat: -41.330162, lng: 174.865694},
      {lat: -42.734358, lng: 147.439506},
      {lat: -42.734358, lng: 147.501315},
      {lat: -42.735258, lng: 147.438000},
      {lat: -43.999792, lng: 170.463352}
    ];
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let markers = this.intersectionLocations.map((location, i) => {
      return new this.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
    });
  }

  // handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //     'Error: The Geolocation service failed.' :
  //     'Error: Your browser doesn\'t support geolocation.');
  // }
}
