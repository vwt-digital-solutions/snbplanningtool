import { Component, AfterViewInit } from '@angular/core';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { MapService } from 'src/app/services/map.service';

import { WorkItemProviderService } from '../../services/work-item-provider.service';
import { Layer } from '../../models/layer';

import 'leaflet/dist/images/marker-shadow.png';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet.featuregroup.subgroup';

import { map, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  private map: L.map;
  private layerButtons = L.control.layers(null, null, { collapsed: false, position: 'topleft' });
  private parentCluster: L.markerClusterGroup = L.markerClusterGroup({
    animate: false,
    chunkedLoading: true,
    showCoverageOnHover: false,
    disableClusteringAtZoom: this.mapService.config.disableClusteringAtZoom,
    iconCreateFunction: (cluster) => this.createClusterIcon(cluster),
  });

  private clusters: any = {};

  constructor(
    public authRoleService: AuthRoleService,
    public mapService: MapService,
    public workProvider: WorkItemProviderService,
  ) {}

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

  private createClusterIcon(cluster: any): L.divIcon {
    const count = cluster.getChildCount();
    const size = (count + '').length;

    const iconSizes = {
      1: [52, 53],
      2: [55, 56],
      3: [65, 66],
      4: [77, 78],
      5: [89, 90]
    };

    return L.divIcon({
      html: count,
      iconUrl: `../../assets/images/clusters/m${size}.png`,
      className: `cluster size-${size}`,
      iconSize: iconSizes[size]
    });
  }

  private addClusters(): void {
    this.map.addLayer(this.parentCluster);

    this.addWorkSubGroup(),
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
        this.layerButtons.removeLayer(this.clusters.cars);
      }

      this.clusters.cars = subGroup;
      this.addLayerButton(subGroup, `AUTO'S`);
      this.map.addLayer(subGroup);
    });
  }

  private createCarPopup(feature): string {
    return `
      <div class="row marker-car">
        <div class="col-12 item driver_name">
          <p>Naam bestuurder</p>
          <span>${feature.properties.driver_name || '-'}</span>
        </div>
        <div class="col-12 item driver_skill">
          <p>Rol bestuurder</p>
          <span>${feature.properties.driver_skill || '-'}</span>
        </div>
        <div class="col-12 item license_plate">
          <p>Kentekenplaat</p>
          <div class="license-plate license-nl">
            <span>${feature.properties.license_plate || 'N/B'}</span>
          </div>
        </div>
      </div>`;
  }

  private createWorkPopup(feature): string {
    const properties = feature.properties;
    let start_time = null;
    let end_time = null;
    let html = [
      `<div class="row marker-work no-gutters">`,
      `<div class="col-12 marker-work-inner">`
    ];

    if ('start_timestamp' in properties) {
      start_time = new Date(properties.start_timestamp).toLocaleString().split(',');
    }

    if ('end_timestamp' in properties) {
      end_time = new Date(properties.end_timestamp).toLocaleString().split(',');
    }

    html.push(`
      <div class="row">
        <div class="col-4 item project_number">
          <p>Projectnummer</p>
          <span> ${properties.project_number || '-'}</span>
        </div>
        <div class="col-4 item task_type">
          <p>Taaktype</p>
          <span> ${properties.task_type || '-'}</span>
        </div>
        <div class="col-4 item status">
          <p>Status</p>
          <span> ${properties.status || '-'}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-12 item description">
          <p>Beschrijving</p>
          <span> ${properties.description || '-'}</span>
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

    if (properties.city || properties.zip || properties.street) {
      const locationProperties = ['<div class="row">'];

      // Add city
      locationProperties.push(`
        <div class="col-4 item city">
          <p>Plaats</p>
          <span> ${properties.city || 'N/B'}</span>
        </div>`);

      // If exists add zip
      if (properties.zip) {
        locationProperties.push(`
          <div class="col-4 item zip">
            <p>Postcode</p>
            <span> ${properties.zip}</span>
          </div>`);
      }

      // If exists add street
      if (properties.street) {
        locationProperties.push(`
          <div class="col-4 item street">
            <p>Straat</p>
            <span> ${properties.street}</span>
          </div>`);
      }
      locationProperties.push('</div>');

      // If exists add employee name
      if (properties.employee_name) {
        locationProperties.push(`
        <div class="row">
          <div class="col-12 item employee_name">
            <p>Naam werknemer</p>
            <span> ${properties.employee_name}</span>
          </div>
        </div>`);
      }

      html = html.concat(locationProperties);
    }

    html.push('</div></div>');
    return html.join('');
  }

  private getCorrespondingIcon(layer: Layer): L.icon {
    const iconPath = '../../../assets/images';
    const iconUrl = layer === 'cars' ?
      `${iconPath}/car-location.png` :
      `${iconPath}/work-location.png`;

    return L.icon({
      iconUrl,
      iconSize: [32, 33],
      iconAnchor: null,
      popupAnchor: [0, 0]
    });
  }

  private createMarker(feature: any): L.marker {
    const coordinates = feature.geometry.coordinates;

    const options = {
      icon: this.getCorrespondingIcon(feature.layer)
    };

    const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), options);

    if (feature.layer === 'cars') {
      const popupOptions = {
        maxWidth: 300,
        minWidth: 200,
      };
      marker.bindPopup(this.createCarPopup(feature), popupOptions);
    }

    if (feature.layer === 'work') {
      const popupOptions = {
        maxWidth: 600,
        minWidth: 400,
        className: ''
      };
      marker.bindPopup(this.createWorkPopup(feature), popupOptions);
    }

    return marker;
  }

  private addLayerButton(layer, name) {
    this.layerButtons.addOverlay(layer, name);
  }

  private removeLayerButton(layer) {
    if (layer) {
      this.layerButtons.removeLayer(layer);
    }
  }

  private addResetZoomButton(): L.Control {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = (map: L.map) => {
      const resetZoom = L.DomUtil.create('a', 'map-ui-element map-btn');
      resetZoom.innerHTML = '<i class="fas fa-home"></i>';

      L.DomEvent
        .disableClickPropagation(resetZoom)
        .addListener(resetZoom, 'click', () => {
          map.setView(map.options.center, map.options.zoom);
        }, resetZoom);
      return resetZoom;
    };
    return control;
  }

  private addZoomButtons(): L.Control {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = (map: L.map) => {
      const wrapper = L.DomUtil.create('div', 'map-ui-element zoom-btns');
      const zoomIn = L.DomUtil.create('div', 'map-btn');
      const zoomOut = L.DomUtil.create('div', 'map-btn');
      zoomIn.innerHTML = '<i class="fas fa-plus"></i>';
      zoomOut.innerHTML = '<i class="fas fa-minus"></i>';

      L.DomEvent.disableClickPropagation(wrapper);

      L.DomEvent.addListener(zoomIn, 'click', () => {
        map.setZoom(map.getZoom() + 1);
      }, zoomIn);
      L.DomEvent.addListener(zoomOut, 'click', () => {
        map.setZoom(map.getZoom() - 1);
      }, zoomOut);

      wrapper.appendChild(zoomIn);
      wrapper.appendChild(zoomOut);

      return wrapper;
    };
    return control;
  }

  private initMap(): void {
    this.map = L.map('map', {
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
    this.addResetZoomButton().addTo(this.map);
    this.addZoomButtons().addTo(this.map);
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
