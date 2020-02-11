import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';
import {WorkItemProviderService} from 'src/app/services/work-item-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authRoleService: AuthRoleService,
    private apiService: ApiService,
    private mapService: MapService,
    private workItemProviderService: WorkItemProviderService
  ) {

    workItemProviderService.loadingSubject.subscribe(
      value => {
        this.mapService.geoJsonReady.work = !value;
      }
    );
  }

  // API CALLS
    private mapGetCars() {
      const that = this;

      this.apiService.apiGet('/cars').subscribe(
        result => {
          (result as any).features.forEach((feature) => {
            (feature as any).layer = 'cars';
            (feature as any).active = that.mapService.markerLayer.cars;
          });

          this.handleResult(result, 'cars');
        },
        error => {
          this.mapService.geoJsonReady.cars = true;
          this.handleError(error);
        }
      );
    }

    private handleError(error) {
      if (error.status !== 403) {
        this.mapService.refreshStatusClass = true;
        this.mapService.refreshStatus = 'Er is een fout opgetreden';
        return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
      }
    }
  // END API CALLS


  // HANDLE RESULTS
    private handleResult(result, layer) {
      const that = this;

      let carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);
      let carsIntervalTimer = 0;

      if (!carInfo || carInfo.items.length <= 0) {
        this.apiService.apiGetCarsInfo();
      }

      const carsInterval = setInterval(() => {
        carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);

        if (carInfo && carInfo.items.length > 0) {
          for (const feature of result.features) {
            for (const item of carInfo.items) {
              if (item.token === feature.properties.token) {
                feature.properties.driver_name = (item.driver_name ? item.driver_name : '');
                feature.properties.license_plate = (item.license_plate ? item.license_plate : '');
              }
            }
          }
          that.featureToMap(result.features, layer);

        } else {
          that.featureToMap(result.features, layer);
        }

        if (carsIntervalTimer <= 10) { clearInterval(carsInterval); }
        carsIntervalTimer++;
      }, 500);
    }

    private featureToMap(features, layer) {
      const that = this;

      features.forEach((feature) => {
        that.mapService.geoJsonObjectCars.features.push(feature);

        if (feature.active) {
          that.mapService.geoJsonObjectActive.features.push(feature);
        }
      });

      this.mapService.geoJsonReady[layer] = true;
      if (this.mapService.geoJsonReady.cars && this.mapService.geoJsonReady.work) {
        this.mapService.geoJsonReady.map = true;
      }
    }
  // END HANDLE RESULTS


  ngOnInit() {
    const that = this;

    const carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);
    this.mapService.geoJsonObjectCars.features = [];
    this.mapService.geoJsonObjectActive.features = [];
    this.mapService.geoJsonReady = { map: false, cars: false, work: !this.workItemProviderService.loading };

    this.route.paramMap.subscribe(params => {
      if (params.get('trackerId')) {
        if (params.get('trackerId').indexOf('vwt') > -1) {
          this.mapService.activeTokenId = params.get('trackerId').replace(/-/g, '/');
        } else {
          this.mapService.activeTokenId = params.get('trackerId');
        }
      } else {
        this.mapService.activeTokenId = '';
      }
    });

    if (!carInfo || carInfo.items.length <= 0) {
      this.apiService.apiGetCarsInfo();
    }

    this.mapGetCars();

    setInterval(() => {
      this.mapService.geoJsonObjectCars.features = [];
      this.mapService.geoJsonObjectActive.features = [];

      this.mapGetCars();
    }, (5 * 60 * 1000));
  }
}
