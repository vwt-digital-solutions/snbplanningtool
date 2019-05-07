import { Component } from '@angular/core';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { EnvService } from 'src/app/services/env.service';
import { MapService } from 'src/app/services/map.service';

import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { ClusterManager } from '@agm/js-marker-clusterer';
import { ControlPosition } from '@agm/core/services/google-maps-types';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  constructor(
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public clusterManager: ClusterManager
  ){}

  ngOnInit(){
    this.mapService.setMapMarkers();
  }

  refreshStatusClasses() {
    return {
      small: true,
      error: this.mapService.refreshStatusClass
    }
  }

  clickedMarker(infoWindow: any) {
    if(infoWindow){
      infoWindow._openInfoWindow();
    }
  }

  setLayer(layer){
    let that = this;
    this.mapService.markerLayer[layer] = (this.mapService.markerLayer[layer] ? false : true);

    this.mapService.geoJsonObjectAll.features.forEach(function(feature){
      if(feature.layer == layer){
        feature.active = that.mapService.markerLayer[layer];
      }
    });

    this.mapService.setMapMarkers();
  }

  resetZoom() {
    this.mapService.zoomLevel = 8;
  }

  mapReady(event: any) {
    event.controls[ControlPosition.BOTTOM_RIGHT].push(document.getElementById('resetZoom'));
    event.controls[ControlPosition.TOP_LEFT].push(document.getElementById('setMarkerLayers'));
  }

  zoomChange(event: any) {
    this.mapService.zoomLevel = event;
  }
}

export class MapsConfig implements LazyMapsAPILoaderConfigLiteral{
  public apiKey: string
  constructor(env: EnvService) {
    this.apiKey = env.googleMapsKey
  }
}
