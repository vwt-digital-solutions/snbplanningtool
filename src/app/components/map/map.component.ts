import { Component } from '@angular/core';
import { Location } from '@angular/common';

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
    private location: Location,
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public clusterManager: ClusterManager
  ){}

  private setActiveMarker(){
    let that = this;
    var hasExistingMarker: boolean = false;

    this.mapService.geoJsonObjectActive.features.forEach(function(feature){
      if(feature.properties['token'] == that.mapService.activeTokenId || feature.properties['L2GUID'] == that.mapService.activeTokenId){
        hasExistingMarker = true;
        if(that.mapService.zoomLevel != 16){
          that.mapService.zoomLevel = 16;
        }
      }
    });

    this.mapService.refreshStatus = 'Auto refresh (5 min.)';
    if(!hasExistingMarker){
      that.location.go('/map');
    }
  }

  private panToActiveMarker(coordinateType){
    let that = this;
    var coordinate: string;

    this.mapService.geoJsonObjectActive.features.forEach(function(feature){
      if(feature.properties['token'] == that.mapService.activeTokenId || feature.properties['L2GUID'] == that.mapService.activeTokenId){
        coordinate = (coordinateType == 'lng' ? feature.geometry.coordinates[0] : feature.geometry.coordinates[1]);
      }
    });

    return (coordinate ? coordinate : this.mapService[coordinateType]);
  }

  public refreshStatusClasses() {
    return {
      small: true,
      error: this.mapService.refreshStatusClass
    }
  }

  public setLayer(layer){
    let that = this;
    this.mapService.markerLayer[layer] = (this.mapService.markerLayer[layer] ? false : true);
    this.location.go('/map');

    this.mapService.geoJsonObjectAll.features.forEach(function(feature){
      if(feature.layer == layer){
        feature.active = that.mapService.markerLayer[layer];
      }
    });

    this.mapService.setMapMarkers();
  }

  public resetZoom() {
    this.mapService.zoomLevel = 8;
    this.location.go('/map');
  }

  public mapReady(event: any) {
    if(this.mapService.geoJsonReady.map){
      this.mapIsReady(event);
    } else{
      var mapIntervalCount: number = 0,
        mapInterval = setInterval(function(){
          if(this.mapService.geoJsonReady.map){
            clearInterval(mapInterval);
            this.mapIsReady(event);
          }
          if(mapIntervalCount >= 8){
            this.mapService.refreshStatus = 'An error has occurred.';
            clearInterval(mapInterval);
          };
          mapIntervalCount++
        }, 1000);
    }


  }

  private mapIsReady(event: any){
    let that = this;

    this.mapService.refreshUpdate = Date.now();
    this.mapService.refreshStatus = 'Processing <i class="fas fa-sync-alt fa-spin"></i>';

    event.controls[ControlPosition.BOTTOM_RIGHT].push(document.getElementById('resetZoom'));
    event.controls[ControlPosition.TOP_LEFT].push(document.getElementById('setMarkerLayers'));

    if(this.mapService.activeTokenId){
      this.setActiveMarker();
    } else{
      this.mapService.refreshStatus = 'Auto refresh (5 min.)';
    }
  }

  public zoomChange(event: any) {
    this.mapService.zoomLevel = event;
  }

  public infoWindowBeforeOpen(marker){
    if(marker.properties.token){
      this.location.go('/map/'+ marker.properties.token.replace(/\//g, '-'));
    } else if(marker.properties.L2GUID){
      this.location.go('/map/'+ marker.properties.L2GUID);
    }
  }

  public infoWindowAfterClose(marker){
    var isNotActive: boolean = false;
    if(marker.properties.token && window.location.pathname.indexOf(marker.properties.token.replace(/\//g, '-')) > -1){
      isNotActive = true;
    } else if(marker.properties.L2GUID && window.location.pathname.indexOf(marker.properties.L2GUID) > -1){
      isNotActive = true;
    }

    if(isNotActive){
      this.location.go('/map');
    }
  }

  ngOnInit(){
    this.mapService.setMapMarkers();
  }
}

export class MapsConfig implements LazyMapsAPILoaderConfigLiteral{
  public apiKey: string
  constructor(env: EnvService) {
    this.apiKey = env.googleMapsKey
  }
}
