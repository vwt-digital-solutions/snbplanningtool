import { Component, AfterViewInit } from '@angular/core';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { MapService } from 'src/app/services/map.service';

import {WorkItemProviderService} from "../../services/work-item-provider.service";
import { Layer } from '../../models/layer';

import "leaflet/dist/images/marker-shadow.png";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.gridlayer.googlemutant';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  private map: L.map;
  private clusters: object = {};
  
  constructor(
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public workItemProviderService : WorkItemProviderService,
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.addClusters();
  }

  private createClusterIcon(cluster: any): L.divIcon {
    const count = cluster.getChildCount();
    const size = (count + '').length;

    const iconSizes = {
      '1': [52, 53],
      '2': [55, 56],
      '3': [65, 66],
      '4': [77, 78],
      '5': [89, 90]
    }

    return L.divIcon({
      html: count,
      iconUrl: `../../assets/images/clusters/m${size}.png`,
      className: `cluster size-${size}`,
      iconSize: iconSizes[size]
    });
  }

  private createEmptyCluster(): L.markerClusterGroup {
    return L.markerClusterGroup({
      animate: false,
      chunkedLoading: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => this.createClusterIcon(cluster),
    });
  }

  private addClusters(): void {
    const layers = this.mapService.config.layers;
    layers.forEach(layer => {
      const cluster = this.createEmptyCluster();
      this.clusters[layer] = cluster;
      this.map.addLayer(cluster);
    });

    this.addMarkers(layers);
  }

  private addMarkers(layers: string[]): void {
    this.mapService.mapFeatures.subscribe(features => {
      const markers: object = {};

      features.forEach(feature => {
        if (feature['geometry'] && feature['layer']) {
          const marker = this.createMarker(feature);

          if (!markers.hasOwnProperty(feature.layer)) {
            markers[feature.layer] = []
          }

          markers[feature.layer].push(marker);
        }
      });

      for (const layer of Object.keys(markers)) {
        this.clusters[layer].clearLayers();
        this.clusters[layer].addLayers(markers[layer]);
      }
    });
  }

  private getCorrespondingIcon(layer: Layer): L.icon {
    const iconPath = '../../../assets/images'
    const iconUrl = layer == 'cars' ?
      `${iconPath}/car-location.png` :
      `${iconPath}/work-location.png`;
    
    return  L.icon({
      iconUrl: iconUrl, 
      iconSize: [32, 33],
      iconAnchor: null,
      popupAnchor: [0, 0]
    })
  }

  private createCarPopup(feature): string {
    return `
      <div class="row marker-car">
        <div class="col-12 item driver_name">
          <p>Naam bestuurder</p>
          <span>${feature['properties']['driver_name'] || '-'}</span>
        </div>
        <div class="col-12 item license_plate">
          <p>Kentekenplaat</p>
          <span class="license-plate license-nl">${feature['properties']['license_plate'] || 'N/B'}</span>
        </div>
      </div>`;
  }

  private createWorkPopup(feature): string {
    let start_time = null;
    let end_time = null;
    let html = [
      `<div class="row marker-work no-gutters">`,
      `<div class="col-12 marker-work-inner">`
    ]

    if ('start_timestamp' in feature) {
      start_time = new Date(feature['start_timestamp']).toLocaleString().split(',')
    }

    if ('end_timestamp' in feature) {
      end_time = new Date(feature['end_timestamp']).toLocaleString().split(',')
    }

    html.push(`
      <div class="row">
        <div class="col-4 item project_number">
          <p>Projectnummer</p>
          <span> ${feature['project_number'] || '-'}</span>
        </div>
        <div class="col-4 item task_type">
          <p>Taaktype</p>
          <span> ${feature['task_type'] || '-'}</span>
        </div>
        <div class="col-4 item status">
          <p>Status</p>
          <span> ${feature['status'] || '-'}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-12 item description">
          <p>Beschrijving</p>
          <span> ${feature['description'] || '-'}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-6 item date">
          <p>Startdatum</p>
          <span> ${ start_time[0] || 'N/B'}</span>
          <span> ${ start_time[1] || 'N/B'}</span>
        </div>
        <div class="col-6 item date">
          <p>Einddatum</p>
          <span> ${ end_time[0]  || '-'}</span>
          <span> ${ end_time[1]  || '-'}</span>
        </div>
      </div>`);

    if (feature.city || feature.zip || feature.street) {
      const locationProperties = ['<div class="row">']
      
      // Add city
      locationProperties.push(`
        <div class="col-4 item city">
          <p>Plaats</p>
          <span> ${feature.city || 'N/B'}</span>
        </div>`)

      // If exists add zip
      if (feature['zip']) {
        locationProperties.push(`
          <div class="col-4 item zip">
            <p>Postcode</p>
            <span> ${feature.zip}</span>
          </div>`);
      }

      // If exists add street
      if (feature['street']) {
        locationProperties.push(`
          <div class="col-4 item street">
            <p>Straat</p>
            <span> ${feature.street}</span>
          </div>`);
      }

      // If exists add employee name
      if (feature['employee_name']) {
        locationProperties.push(`
        <div class="row">
          <div class="col-12 item employee_name">
            <p>Naam werknemer</p>
            <span> ${feature.employee_name}</span>
          </div>
        </div>`)
      }
      locationProperties.push('</div>')

      html = html.concat(locationProperties)
    }

    html.push("</div></div>");
    return html.join('');
  }

  private createMarker(feature: any): L.marker {
    const coordinates = feature['geometry']['coordinates'];
    
    const options = {
      icon: this.getCorrespondingIcon(feature.layer)
    };

    const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), options);

    // if (feature.layer == 'cars') {
    //   marker.bindPopup(this.createCarPopup(feature));
    // }

    // if (feature.layer == 'work') {
    //   marker.bindPopup(this.createWorkPopup(feature));
    // }

    return marker;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [
        this.mapService.config.defaults.lat,
        this.mapService.config.defaults.lng
      ],
      zoom: this.mapService.config.defaults.zoomLevel,
      minZoom: this.mapService.config.minZoom,
    });

    // Add google maps tiling
    const tiles = L.gridLayer.googleMutant({
      type: 'roadmap',
      styles: this.mapService.config.styles
    })

    tiles.addTo(this.map);
    this.addResetZoomButton().addTo(this.map);
  }

  private addResetZoomButton(): L.Control {
    const control = new L.Control({ position: 'topleft' });
    control.onAdd = (map) => {
      const azoom = L.DomUtil.create('a','resetzoom');
      azoom.innerHTML = '<i class="fas fa-home"></i>';
      azoom.className = 'resetzoom-btn';

      L.DomEvent
        .disableClickPropagation(azoom)
        .addListener(azoom, 'click', function () {
          map.setView(map.options.center, map.options.zoom);
        }, azoom);
      return azoom;
    };
    return control;
  }

  // private setActiveMarker() {
  //   const that = this;
  //   let hasExistingMarker = false;

  //   this.mapService.geoJsonObjectActive.features.forEach((feature: any) => {
  //     if (feature.properties.token === that.mapService.activeTokenId || feature.properties.L2GUID === that.mapService.activeTokenId) {
  //       hasExistingMarker = true;
  //       if (that.mapService.zoomLevel !== 16) {
  //         that.mapService.zoomLevel = 16;
  //       }
  //     }
  //   });

  //   this.mapService.refreshStatus = 'Automatisch vernieuwen (5 min.)';
  //   if (!hasExistingMarker) {
  //     that.location.go('/map');
  //   }
  // }

  // private panToActiveMarker(coordinateType: string) {
  //   const that = this;
  //   let coordinate: string;

  //   this.mapService.geoJsonObjectActive.features.forEach((feature: any) => {
  //     if (feature.properties.token === that.mapService.activeTokenId || feature.properties.L2GUID === that.mapService.activeTokenId) {
  //       coordinate = (coordinateType === 'lng' ? feature.geometry.coordinates[0] : feature.geometry.coordinates[1]);
  //     }
  //   });

  //   return (coordinate ? coordinate : this.mapService[coordinateType]);
  // }

  public refreshStatusClasses() {
    return {
      small: true,
      error: this.mapService.refreshStatusClass
    };
  }

  // public setLayer(layer: string) {
  //   const that = this;
  //   this.mapService.markerLayer[layer] = (this.mapService.markerLayer[layer] ? false : true);
  //   this.location.go('/map');

  //   this.mapService.geoJsonObjectAll.features.forEach((feature: any) => {
  //     if (feature.layer === layer) {
  //       feature.active = that.mapService.markerLayer[layer];
  //     }
  //   });

  //   this.mapService.setMapMarkers();
  // }

  public mapReady(event: any) {
    if (this.mapService.geoJsonReady.map) {
      this.mapIsReady(event);
    } else {
      let mapIntervalCount = 0;
      const mapInterval = setInterval(function() {
          if (this.mapService.geoJsonReady.map) {
            clearInterval(mapInterval);
            this.mapIsReady(event);
          }
          if (mapIntervalCount >= 8) {
            this.mapService.refreshStatus = 'Er is een fout opgetreden.';
            clearInterval(mapInterval);
          }
          mapIntervalCount++;
        }, 1000);
    }
  }

  private mapIsReady(event: any) {
    this.mapService.refreshUpdate = Date.now();
    this.mapService.refreshStatus = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';

    if (this.mapService.activeTokenId) {
      // this.setActiveMarker();
    } else {
      this.mapService.refreshStatus = 'Automatisch vernieuwen (5 min.)';
    }
  }

  // public zoomChange(event: any) {
  //   this.mapService.zoomLevel = event;
  // }

  // public infoWindowBeforeOpen(marker: any) {
  //   if (marker.properties.token) {
  //     this.location.go('/map/' + marker.properties.token.replace(/\//g, '-'));
  //   } else if (marker.properties.L2GUID) {
  //     this.location.go('/map/' + marker.properties.L2GUID);
  //   }
  // }

  // public infoWindowAfterClose(marker: any) {
  //   let isNotActive = false;
  //   if (marker.properties.token && window.location.pathname.indexOf(marker.properties.token.replace(/\//g, '-')) > -1) {
  //     isNotActive = true;
  //   } else if (marker.properties.L2GUID && window.location.pathname.indexOf(marker.properties.L2GUID) > -1) {
  //     isNotActive = true;
  //   }

  //   if (isNotActive) {
  //     this.location.go('/map');
  //   }
  // }

  // public getDriverName(feature): string {
  //   if (feature['layer'] == 'cars' && feature['properties']['driver_name']) {
  //     return feature['properties']['driver_name']
  //   }

  //   // Return space string (empty string returns [object Object] internally (AGM BUG))
  //   return ' ';
  // }

  // ngOnInit() {
  //   this.mapService.setMapMarkers();
  // }


}
