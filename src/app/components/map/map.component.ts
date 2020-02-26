import {Component, AfterViewInit, HostBinding} from '@angular/core';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { MapService } from 'src/app/services/map.service';

import { WorkItemProviderService } from '../../services/work-item-provider.service';

import { map, take, withLatestFrom } from 'rxjs/operators';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet.featuregroup.subgroup';
import {
  createClusterIcon,
  createCarMarker,
  createWorkMarker,
  addResetZoomButton,
  addZoomButtons
} from './leaflet.helpers';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  @HostBinding('class.map-component')

  private map: L.map;
  private layerButtons = L.control.layers(null, null, { collapsed: false, position: 'topleft' });
  private parentCluster: L.markerClusterGroup = L.markerClusterGroup({
    animate: false,
    chunkedLoading: true,
    showCoverageOnHover: false,
    disableClusteringAtZoom: this.mapService.config.disableClusteringAtZoom,
    iconCreateFunction: (cluster) => createClusterIcon(cluster),
  });

  private clusters: any = {};

  constructor(
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public workProvider: WorkItemProviderService,
  ) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.layerButtons.addTo(this.map);
    this.addClusters();
  }

  refreshStatusClasses() {
    return {
      small: true,
      error: this.mapService.refreshStatusClass
    };
  }

  private addClusters(): void {
    this.map.addLayer(this.parentCluster);

    this.addWorkSubGroup();
    this.addCarSubGroup();
  }

  private addWorkSubGroup(): void {
    this.workProvider.mapWorkItemsSubject.subscribe(features => {
      let markers = features.map(feature => this.createMarker(feature));
      const subGroup = L.featureGroup.subGroup(this.parentCluster, markers);
      markers = [];

      if (this.clusters.work) {
        this.parentCluster.removeLayer(this.clusters.work);
        this.removeLayerButton(this.clusters.work);
      }

      this.clusters.work = subGroup;
      this.addLayerButton(subGroup, 'WERK');
      this.map.addLayer(subGroup);
    });
  }

  private addCarSubGroup(): void {
    this.mapService.geoJsonObjectCars.features.subscribe(features => {
      let markers = features.map(feature => this.createMarker(feature));
      const subGroup = L.featureGroup.subGroup(this.parentCluster, markers);
      markers = [];

      if (this.clusters.cars) {
        this.parentCluster.removeLayer(this.clusters.cars);
        this.removeLayerButton(this.clusters.cars);
      }

      this.clusters.cars = subGroup;
      this.addLayerButton(subGroup, `AUTO'S`);
      this.map.addLayer(subGroup);
    });
  }

  private createMarker(feature: any): L.marker {
    const coordinates = feature.geometry.coordinates;
    const options = {
      marker: {
        keyboard: false,
      },
      icon: {
        iconSize: [32, 33],
        iconAnchor: null,
        popupAnchor: [0, 0]
      }
    };

    if (feature.layer === 'cars') {
      return createCarMarker(feature, options, coordinates);
    } else if (feature.layer === 'work') {
      return createWorkMarker(feature, options, coordinates);
    }
  }

  private addLayerButton(layer, name) {
    this.layerButtons.addOverlay(layer, name);
  }

  private removeLayerButton(layer) {
    if (layer) {
      this.layerButtons.removeLayer(layer);
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      preferCanvas: true,
      // zoomAnimation: false, // If the map ever ends up lagging disable zoom animations entirely (zoomAnimationThreshold could then be removed)
      zoomAnimationThreshold: 1,
      markerZoomAnimation: false,
      center: [
        this.mapService.config.defaults.lat,
        this.mapService.config.defaults.lng
      ],
      attributionControl: false,
      zoomControl: false,
      zoom: this.mapService.config.defaults.zoomLevel,
      minZoom: this.mapService.config.minZoom
    });

    // Add google maps tiling
    const tiles = L.gridLayer.googleMutant({
      type: 'roadmap',
      styles: this.mapService.config.styles
    });

    tiles.addTo(this.map);
    addResetZoomButton().addTo(this.map);
    addZoomButtons().addTo(this.map);

    this.mapService.mapResized.subscribe(() => {setTimeout(() => {this.map.invalidateSize(true);}, 50);});

    this.mapReady();
  }

  private setActiveMarker() {
    this.mapService.activeTokenId
      .pipe(
        // Get latest features
        withLatestFrom(
          this.mapService.geoJsonObjectCars.features,
          this.workProvider.mapWorkItemsSubject
        ),
        // Find features with this tokenId
        map(([activeTokenId, cars, work]) => [...cars, ...work].filter(feature =>
          (feature.properties.token === activeTokenId || feature.properties.L2GUID === activeTokenId))
        ),
      )
      .subscribe(features => {
        const feature = features[0];

        if (feature) {
          const coordinates = feature.geometry.coordinates;

          // Zoom marker into center of view
          this.map.setZoomAround(L.latLng(coordinates[1], coordinates[0]), 16);
        }
      });

    this.mapService.refreshStatus = 'Automatisch vernieuwen (5 min.)';
  }

  private mapReady() {
    if (this.mapService.geoJsonReady.map) {
      this.mapIsReady();
    } else {
      let mapIntervalCount = 0;
      const mapInterval = setInterval(((self) => {
        return () => {
          if (self.mapService.geoJsonReady.map) {
            clearInterval(mapInterval);
            self.mapIsReady();
          }
          if (mapIntervalCount >= 8) {
            clearInterval(mapInterval);
            self.mapService.refreshStatus = 'Er is een fout opgetreden.';
          }
          mapIntervalCount++;
        };
      })(this), 1000);
    }
  }

  private mapIsReady() {
    this.mapService.refreshUpdate = Date.now();
    this.mapService.refreshStatus = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';

    this.mapService.activeTokenId.pipe(take(1)).subscribe(activeTokenId => {
      if (activeTokenId) {
        this.setActiveMarker();
      } else {
        this.mapService.refreshStatus = 'Automatisch vernieuwen (5 min.)';
      }
    });
  }
}
