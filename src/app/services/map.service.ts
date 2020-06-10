import { Injectable } from '@angular/core';

import {BehaviorSubject, Subject} from 'rxjs';
import {CustomLayer} from '../models/layer';
import {LazyMapsAPILoaderConfigLiteral} from '@agm/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public mapConfigComplete = false;
  activeTokenId = new BehaviorSubject<string>(null);
  clickedMarker = false;

  geoJsonReady = {
    map: false,
    cars: false,
    work: false
  };

  refreshUpdate: number;
  refreshStatus = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';
  refreshStatusClass = false;

  mapResized = new Subject<void>();

  config = {
    layers: ['cars', 'work'],
    defaults: {
      lat: 52.155285,
      lng: 5.387219,
      zoomLevel: 8
    },
    styles: [
      {
        elementType: 'geometry',
        stylers: [ { color: '#cccccc' } ]
      },
      {
        elementType: 'labels.icon',
        stylers: [ { visibility: 'off' } ]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [ { color: '#000000' } ]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [ { color: '#f5f5f5' } ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [ { color: '#000000' }, { visibility: 'on' }, { weight: 0.5 } ]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#bdbdbd' } ]
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'landscape.man_made',
        stylers: [ { color: '#d3b091' } ]
      },
      {
        featureType: 'landscape.natural.terrain',
        stylers: [ { color: '#b4b4b4' } ]
      },
      {
        featureType: 'poi',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [ { color: '#eeeeee' } ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#757575' } ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [ { color: '#a1c2af' } ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#9e9e9e' } ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [ { color: '#d4d8d8' } ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [ { visibility: 'on' } ]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [ { visibility: 'on' } ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#000000' } ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [ { color: '#ecf0f1' } ]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#000000' } ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#000000' } ]
      },
      {
        featureType: 'transit',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [ { color: '#e5e5e5' } ]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [ { color: '#eeeeee' } ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [ { color: '#cce7f0' } ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [ { visibility: 'off' } ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [ { color: '#9e9e9e' } ]
      }
    ],
    minZoom: 8,
    disableClusteringAtZoom: 15,
    markerPopupOnHover: false,
  };

  customLayersSubject = new Subject<CustomLayer>();

  public addCustomLayer(layer: CustomLayer): void {
    this.customLayersSubject.next(layer);
  }
}

@Injectable()
export class MapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries: string[];
  public language: string;
  public region: string;

  constructor(private apiService: ApiService, private mapService: MapService
  ) {
    this.libraries = ['directions'];
    this.language = 'nl';
    this.region = 'NL';
    this.apiService.getMapConfig().subscribe((response: any) => {
      this.apiKey = response;
      this.mapService.mapConfigComplete = true;
    }, (error: any) => {
      console.log(error);
    });
  }
}
