import {Component, AfterViewInit, HostBinding, ComponentFactoryResolver, Injector} from '@angular/core';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import {CarProviderService} from '../../services/car-provider.service';
import { MapService } from 'src/app/services/map.service';
import { WorkItemProviderService } from '../../services/work-item-provider.service';

import { map, take, withLatestFrom } from 'rxjs/operators';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet.featuregroup.subgroup';

import { Helpers } from './leaflet.helpers';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  @HostBinding('class.map-component') true;

  private map: L.map;
  private layerButtons = L.control.layers(null, null, { collapsed: false, position: 'topleft' });
  private parentCluster: L.markerClusterGroup = L.markerClusterGroup({
    animate: false,
    chunkedLoading: true,
    showCoverageOnHover: false,
    disableClusteringAtZoom: this.mapService.config.disableClusteringAtZoom,
    iconCreateFunction: (cluster) => this.helpers.createClusterIcon(cluster),
  });

  private clusters: any = {};
  private helpers: Helpers;

  constructor(
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public workProvider: WorkItemProviderService,
    public carProvider: CarProviderService,
    public resolver: ComponentFactoryResolver,
    public injector: Injector
  ) {
    this.helpers = new Helpers(this.mapService, resolver, injector);
  }

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

    this.workProvider.workItemsSubject.subscribe(items => {
      this.addMapLayer('work', 'WERK', items);
    });

    this.carProvider.carsLocationsSubject.subscribe(items => {
      this.addMapLayer('cars', 'AUTO\'S', items);
    });

    this.mapService.customLayersSubject.subscribe(layer => {
      this.addMapLayer('customLayer', layer.title, layer.items);
      this.parentCluster.removeLayer(this.clusters.work);
      this.parentCluster.removeLayer(this.clusters.cars);
    });
  }

  private addMapLayer(layerIdentifier, layerName, items) {
    const markers = [];

    for (const item of items) {
      const marker = this.helpers.createMarker(item);
      if (marker) {
        markers.push(marker);
      }
    }

    const subGroup = L.featureGroup.subGroup(this.parentCluster, markers);

    if (this.clusters[layerIdentifier]) {
      this.parentCluster.removeLayer(this.clusters[layerIdentifier]);
      this.removeLayerButton(this.clusters[layerIdentifier]);
    }

    this.clusters[layerIdentifier] = subGroup;
    this.addLayerButton(subGroup, layerName);
    this.map.addLayer(subGroup);
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
      // If map lags disable zoom animations (zoomAnimationThreshold could then be removed)
      // zoomAnimation: false,
      zoomAnimationThreshold: 1,
      markerZoomAnimation: false,
      center: [
        this.mapService.config.defaults.lat,
        this.mapService.config.defaults.lng
      ],
      attributionControl: false,
      zoomControl: false,
      zoom: this.mapService.config.defaults.zoomLevel,
      minZoom: this.mapService.config.minZoom,
    });

    // Add google maps tiling
    const tiles = L.gridLayer.googleMutant({
      type: 'roadmap',
      styles: this.mapService.config.styles
    });

    tiles.addTo(this.map);

    // Add map UI
    this.helpers.resetZoomButton().addTo(this.map);
    this.helpers.zoomButtons().addTo(this.map);
    this.helpers.hoverModeSwitch().addTo(this.map);

    // Add hover over popup
    this.map.on({
      click: () => {
        this.mapService.clickedMarker = false;
      },
      popupclose: () => {
        this.mapService.clickedMarker = false;
      }
    });

    // Resize map on filter close
    this.mapService.mapResized.subscribe(() => setTimeout(() => this.map.invalidateSize(true), 50));

    this.mapService.customLayersSubject.subscribe(value => {


    });


    this.mapReady();
  }

  private setActiveMarker() {
    this.mapService.activeTokenId
      .pipe(
        // Get latest features
        withLatestFrom(
          this.carProvider.carsLocationsSubject,
          this.workProvider.workItemsSubject
        ),
        // Find features with this tokenId
        map(([activeTokenId, cars, work]) => [...cars, ...work].filter(feature =>
          (feature.token === activeTokenId || feature.l2_guid === activeTokenId))
        ),
      )
      .subscribe(features => {
        const feature = features[0];

        if (feature) {
          const coordinates = feature.geometry.coordinates;

          // Zoom marker into center of view
          this.map.setZoom(15);
          this.map.panTo(L.latLng(coordinates[1], coordinates[0]));
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
