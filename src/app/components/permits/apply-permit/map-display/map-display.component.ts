import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoogleMap,
  MapDirectionsService,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { BehaviorSubject, map } from 'rxjs';
import { MapInformation } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss']
})
export class MapDisplayComponent {
  @ViewChild('map', { static: true })
  map!: GoogleMap;
  markers: any[] = [];
  infoContent = '';
  @ViewChild('map') mapElement: any; 
  @ViewChild('markerElem') markerElem!: MapMarker;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  polygons: any[] = [];

  @Input() mapInformation: MapInformation | undefined;
  markerPositions: google.maps.LatLng[] = [];

  zoom = 10;

  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  constructor(private directionsService: MapDirectionsService) {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    const fromLocation = this.mapInformation?.placeSearchResult?.location;
    if (fromLocation) {
      this.gotoLocation(fromLocation);
    }
  }

  gotoLocation(location: google.maps.LatLng) {
    this.markerPositions = [location];
    this.map.panTo(location);
    this.zoom = 13;
    this.directionsResult$.next(undefined);
    this.markers = this.mapInformation?.markers!;
    this.polygons = this.mapInformation?.polygons!;
  }

  getDirections(
    fromLocation: google.maps.LatLng,
    toLocation: google.maps.LatLng
  ) {
    const request: google.maps.DirectionsRequest = {
      destination: toLocation,
      origin: fromLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService
      .route(request)
      .pipe(map((response) => response.result))
      .subscribe((res) => {
        this.directionsResult$.next(res);
        this.markerPositions = [];
      });
  }

  openInfo(marker: any) {
    this.infoContent = marker.info;
    this.infoWindow.position = marker.position;
    this.infoWindow.open();
  }
}
