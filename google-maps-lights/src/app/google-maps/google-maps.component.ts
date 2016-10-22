import {Component, AfterViewInit} from '@angular/core';

import * as googleMapsApi from 'google-maps-api';

interface Intersection {
  lat: number;
  lng: number;
  label: string;
}

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements AfterViewInit {
  map;
  maps;
  infoWindow;
  mapCenter = {lat: 44.427828, lng: 26.103897};
  intersectionLocations: Intersection[];
  directionsService;
  directionsDisplay;
  listaStrazi = '';

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
      zoom: 14
    });

    let rendererOptions = {
      map: this.map
    };

    this.infoWindow = new this.maps.InfoWindow(rendererOptions);
    this.directionsDisplay = new this.maps.DirectionsRenderer(rendererOptions)
  }

  getRoute(start, end) {
    // let start = 'Strada Postavarului, Bucuresti';
    // let end = 'Piata Unirii, Bucuresti';
    let request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };

    return new Promise((resolve, reject) => {
      this.directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          console.log(response);
          resolve(response);
          // this.directionsDisplay.setDirections(response);
        }
      });
    });
  }

  placeMarkers() {
    this.intersectionLocations = [
      {lat: -31.563910, lng: 147.154312, label: 'A'},
      {lat: -33.718234, lng: 150.363181, label: 'B'},
      {lat: -33.727111, lng: 150.371124, label: 'C'},
      {lat: -33.848588, lng: 151.209834, label: 'D'},
      {lat: -33.851702, lng: 151.216968, label: 'E'}
    ];

    let markers = this.intersectionLocations.map((location, i) => {
      return new this.maps.Marker({
        position: location,
        label: location.label
      });
    });
  }

  getIntersectionsList() {
    console.log(this.listaStrazi.split('\n'));
  }

  // handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //     'Error: The Geolocation service failed.' :
  //     'Error: Your browser doesn\'t support geolocation.');
  // }
}
