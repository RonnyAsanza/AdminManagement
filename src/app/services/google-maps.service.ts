import { Injectable, NgZone  } from '@angular/core';
import { PlaceSearchResult } from '../components/permits/apply-permit/address-autocomplete/address-autocomplete.component';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  strokeColor = '#FF0000';
  fillColor= '#FF0000';
  defaultZoom = 15;
  primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
  secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary');

  constructor() {
  }

  addMarker(title: string, lat: number, lng: number, address: string, tariffName: string, tariffPrice: number) {
    const infoContent = `
      <div class="grid center-content m-0 p-0">
        <div class="col-12 m-0 p-0">
          <div class="grid center-content bg-primary font-bold m-0 p-1">
            <div class="col-6" >
              <span>Parking Rate</span>
              <p>CAD ${tariffPrice}</p>
            </div>
            <div class="col-6">
              <span>${tariffName}</span>
            </div>
          </div>
        </div>
        <div class="col-12 m-0 p-1 mt-2">
          <div class="grid center-content">
            <div class="col-6 pl-4">
              <p>${title}</p>
            </div>
            <div class="col-6">
              <span>${address}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    var marker = {
        position: {
          lat: lat,
          lng: lng,
        },
        label: {
          text: title,
        },
        info: infoContent,
        title: title,
        options: { 
          animation: google.maps.Animation.DROP,
          icon: 'assets/images/logo/marker-image.png'
        },
      };

    return marker;
  }

  addPolygon(title: string, lat: number, lng: number, address: string, tariffName: string, tariffPrice: number, coordinates: string) {
    const infoContent = `
      <div class="grid center-content m-0 p-0">
        <div class="col-12 m-0 p-0">
          <div class="grid center-content bg-primary font-bold m-0 p-1">
            <div class="col-6" >
              <span>Parking Rate</span>
              <p>CAD ${tariffPrice}</p>
            </div>
            <div class="col-6">
              <span>${tariffName}</span>
            </div>
          </div>
        </div>
        <div class="col-12 m-0 p-1 mt-2">
          <div class="grid center-content">
            <div class="col-6 pl-4">
              <p>${title}</p>
            </div>
            <div class="col-6">
              <span>${address}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    var polygon = {
      position: {
        lat: lat,
        lng: lng,
      },
      vertices: this.parseCoordinates(coordinates),
      options: {
        fillColor: this.primaryColor,
        strokeColor: this.secondaryColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0.35,
        title: title,
        label: title
      },
      title: title,
      info: infoContent
    };

    return polygon;
  }

  parseCoordinates(coordinates: string): google.maps.LatLngLiteral[] {
    return coordinates.split('|').map(point => {
      const [lat, lng] = point.split(',').map(parseFloat);
      return { lat, lng };
    });
  }

}

export interface MapInformation{
  placeSearchResult: PlaceSearchResult;
  markers?: any[];
  polygons?: any[];
}

function loadContent(){
  alert('ssss');
}

/*
import { Injectable, NgZone  } from '@angular/core';
import { ZoneViewModel } from '../models/zone.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  map!: google.maps.Map;
  points: google.maps.LatLngLiteral[] = [];
  polygon!: google.maps.Polygon;
  address!: string;
  place!: google.maps.places.PlaceResult | null;
  placesService!: google.maps.places.PlacesService;
  autocomplete!:google.maps.places.Autocomplete;
  strokeColor = '#FF0000';
  fillColor= '#FF0000';
  defaultZoom = 15;
  constructor(private ngZone: NgZone) {
  }
    cleanAddressAndPolygon() {
        this.address = '';
        this.points = [];
        this.polygon?.setMap(null);
        this.place = null;
    }
    getPoints(): string {
        return this.points?.map(point => `${point.lat},${point.lng}`).join('|') || '';
    }

    getAddress(): string {
        return this.address || '';
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
                searchElementRef.value = address;
                this.place = place;
              });
              this.centerMapOnPlace(place);
            });
          } else {
            alert('Place search was not successful for the following reason: ' + status);
          }
        });
    }

    setPolygonCoordinates(coordinates: string) {
        const points = this.parseCoordinates(coordinates);
        points.forEach(point => {
            this.addPoint(point);
        });
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
        google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
          this.ngZone.run(() => {
              const place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
              this.address = place.formatted_address || '';
              if (!this.isPlaceValid(place)) {
                  return;
              }   
              this.place = place;
              this.centerMapOnPlace(place);
          });
        });
        return this.autocomplete;
    }

    createAutocomplete(searchElementRef: any): google.maps.places.Autocomplete {
        let autocomplete = new google.maps.places.Autocomplete(searchElementRef?.nativeElement);
        return autocomplete;
    }

    addPlaceChangedListener(autocomplete: google.maps.places.Autocomplete) {

    }

    isPlaceValid(place: google.maps.places.PlaceResult): boolean {
        return place.geometry !== undefined && place.geometry !== null;
    }

    initMap(mapElement: HTMLElement, zoom: number) {
        this.map = new google.maps.Map(mapElement, {
            zoom: zoom
        });
        this.map.addListener('click', (event) => {
            this.addPoint({ lat: event.latLng.lat(), lng: event.latLng.lng() });
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

  addMarker(title: string, lat: number, long: number): google.maps.Marker | null {
    if (!this.map) {
      console.error('Map is not initialized');
      return null;
    }

    const position = new google.maps.LatLng(lat, long);
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title
    });

    // Example of adding a simple click event to each marker
    marker.addListener('click', () => {
      const infoWindow = new google.maps.InfoWindow({
        content: `<p>${title}</p>`
      });
      infoWindow.open(this.map, marker);
    });

    return marker;
  }

}
*/