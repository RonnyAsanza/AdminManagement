
import { Injectable, NgZone  } from '@angular/core';
import { Subject } from 'rxjs';
import { ZoneViewModel } from 'src/app/models/zone.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  map!: google.maps.Map;
  points: google.maps.LatLngLiteral[] = [];
  polygon!: google.maps.Polygon;
  address!: string;
  placesService!: google.maps.places.PlacesService;
  autocomplete!:google.maps.places.Autocomplete;
  strokeColor = '#FF0000';
  fillColor= '#FF0000';
  defaultZoom = 15;
  private addressSubject = new Subject<{lat: number, long: number} | undefined>();
  address$ = this.addressSubject.asObservable();
  constructor(private ngZone: NgZone) {
  }
    cleanAddressAndPolygon() {
        this.address = '';
        this.points = [];
        this.polygon?.setMap(null);
        this.addressSubject.next(undefined);
    }
    getPoints(): string {
        return this.points?.map(point => `${point.lat},${point.lng}`).join('|') || '';
    }

    getAddress(): string {
        return this.address || '';
    }

    parseCoordinates(coordinates: string): google.maps.LatLngLiteral[] {
        return coordinates.split('|').map(point => {
          const [lat, lng] = point.split(',').map(parseFloat);
          return { lat, lng };
        });
    }

    setPlaceFromFormattedAddress(address: string, searchElementRef: any) {
        const request: google.maps.places.FindPlaceFromQueryRequest = {
          query: address,
          fields: ['name', 'geometry'],
        };
      
        this.placesService.findPlaceFromQuery(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0];
            this.ngZone.run(() => {
              this.ngZone.run(() => {
                this.autocomplete.set('place', place);
                this.address = address;
                this.addressSubject.next({
                    lat: place.geometry?.location.lat() || 0,
                    long: place.geometry?.location.lng() || 0
                });
                searchElementRef.value = address;
              });
              this.centerMapOnPlace(place);
            });
          } else {
            alert('Place search was not successful for the following reason: ' + status);
          }
        });
    }

    setPolygonCoordinates(coordinates: string) {
        this.points = this.parseCoordinates(coordinates);
        this.drawPolygon(this.points);
    }
  
    addPoint(point: google.maps.LatLngLiteral) {
        this.points.push(point);
        const marker = new google.maps.Marker({
            position: point,
            map: this.map
        });
        marker.addListener('click', () => {
            const confirmed = window.confirm('¿Remove?');
            if (confirmed) {
                marker.setMap(null);
                this.removePoint(this.points.indexOf(point));
            }
        });
        this.drawPolygon(this.points);
    }

    removePoint(index: number) {
        if (index > -1 && index < this.points.length) {
          this.points.splice(index, 1);
          this.drawPolygon(this.points);
        }
    }

    initAutocomplete(searchElementRef: any): google.maps.places.Autocomplete {
        this.autocomplete = this.createAutocomplete(searchElementRef);
        this.addPlaceChangedListener(this.autocomplete);
        return this.autocomplete;
    }

    createAutocomplete(searchElementRef: any): google.maps.places.Autocomplete {
        let autocomplete = new google.maps.places.Autocomplete(searchElementRef?.nativeElement);
        return autocomplete;
    }

    addPlaceChangedListener(autocomplete: google.maps.places.Autocomplete) {
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                this.address = place.formatted_address || '';
                this.addressSubject.next({
                    lat: place.geometry?.location.lat() || 0,
                    long: place.geometry?.location.lng() || 0
                });
                if (!this.isPlaceValid(place)) {
                    return;
                }   
                this.centerMapOnPlace(place);
            });
        });
    }

    isPlaceValid(place: google.maps.places.PlaceResult): boolean {
        return place.geometry !== undefined && place.geometry !== null;
    }

    initMap(mapElement: HTMLElement, zoom: number) {
        this.map = new google.maps.Map(mapElement, {
            zoom: zoom,
            disableDefaultUI: true,
            zoomControl: true,
        });
        this.map.addListener('click', (event) => {
            event.stop();
        });
        this.placesService = new google.maps.places.PlacesService(this.map);
    }

    centerMapOnPlace(place: google.maps.places.PlaceResult) {
        if (place.geometry && place.geometry.location) {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(this.defaultZoom);
        }
    }

    drawPolygon(points: google.maps.LatLngLiteral[]) {
        if (this.polygon) {
            this.polygon.setMap(null);
        }
        
        this.polygon = new google.maps.Polygon({
          paths: points,
          strokeColor: this.strokeColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: this.fillColor,
          fillOpacity: 0.35
        });
        this.polygon.setMap(this.map);
    }

    getZonesContainingLocation(zones: ZoneViewModel[], location: {lat: number, lng: number}): ZoneViewModel[] {
        
        const zonesContainingLocation: ZoneViewModel[] = [];
        let latLng = new google.maps.LatLng(location.lat, location.lng);
        for (const zone of zones) {
          const coordinates = zone.coordinates?.split('|').map(coordinate => {
            const [lat, lng] = coordinate.split(',').map(Number);
            return { lat, lng };
          });
          if (coordinates) {
            const polygon = new google.maps.Polygon({ paths: coordinates });
      
            if (google.maps.geometry.poly.containsLocation(latLng, polygon)) {
                zonesContainingLocation.push(zone);
            }
          }
        }
        return zonesContainingLocation;
    }
}