import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authRoleService: AuthRoleService,
    private apiService: ApiService,
    private mapService: MapService
  ) {}

  // API CALLS
    private mapGetCars(){
      let that = this;

      this.apiService.apiGet('/cars').subscribe(
        result => {
          result['features'].forEach(function(feature){
            feature['layer'] = 'cars';
            feature['active'] = that.mapService.markerLayer.cars;
          });

          this.handleResult(result, 'cars');
        },
        error => {
          this.mapService.geoJsonReady.cars = true;
          this.handleError(error);
        }
      );
    }

    private mapGetWorkItems(){
      let that = this;
      this.apiService.apiGet('/workitems/all').subscribe(
        result => {
          var workItems = [];
          for (let item in result) {
            if(result[item].geometry){
              var newWorkItem = { type: "Feature", geometry: { type: "Point", coordinates: [] }, properties: {} };

              for (let property in result[item]) {
                if(property != 'geometry'){
                  newWorkItem.properties[property] = result[item][property];
                } else{
                  newWorkItem.geometry.coordinates = result[item][property].coordinates;
                }
              }
              newWorkItem['layer'] = 'work';
              newWorkItem['active'] = that.mapService.markerLayer.work;
              workItems.push(newWorkItem);
            }
          }

          this.handleResult(workItems, 'work');
        },
        error => {
          this.mapService.geoJsonReady.work = true;
          this.handleError(error);
        }
      );
    }

    private handleError(error) {
      if(error.status != 403){
        this.mapService.refreshStatusClass = true;
        this.mapService.refreshStatus = 'An error has occurred';
        return throwError('Something bad happened, please try again later.');
      }
    };
  // END API CALLS


  // HANDLE RESULTS
    private handleResult(result, layer) {
      let that = this;

      if(layer != 'cars'){
        this.featureToMap(result, layer);
      } else {
        var carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null),
          carsIntervalTimer: number = 0;

        if(!carInfo || carInfo.items.length <= 0){
          this.apiService.apiGetCarsInfo();
        }

        var carsInterval = setInterval(function(){
          var carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null)

          if(carInfo && carInfo.items.length > 0){
            for (let i = 0; i < result.features.length; i++) {
              for (let j = 0; j < carInfo.items.length; j++) {
                if(carInfo.items[j].token == result.features[i].properties.token){
                  result.features[i].properties.driver_name = (carInfo.items[j].driver_name ? carInfo.items[j].driver_name : '');
                  result.features[i].properties.license_plate = (carInfo.items[j].license_plate ? carInfo.items[j].license_plate : '');
                }
              }
            }
            that.featureToMap(result.features, layer);
          }

          if(carsIntervalTimer <= 10){ clearInterval(carsInterval) }
          carsIntervalTimer++;
        }, 500);
      }
    };

    private featureToMap(features, layer){
      let that = this;

      features.forEach(function(feature){
        that.mapService.geoJsonObjectAll.features.push(feature);

        if(feature.active){
          that.mapService.geoJsonObjectActive.features.push(feature);
        }
      });

      this.mapService.geoJsonReady[layer] = true;
      if(this.mapService.geoJsonReady.cars && this.mapService.geoJsonReady.work){
        this.mapService.geoJsonReady.map = true;
      }
    }
  // END HANDLE RESULTS


  ngOnInit(){
    let that = this;

    var carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);
    this.mapService.geoJsonObjectAll.features = [];
    this.mapService.geoJsonObjectActive.features = [];
    this.mapService.geoJsonReady = { map: false, cars: false, work: false };

    this.route.paramMap.subscribe(params => {
      if(params.get('trackerId')){
        if(params.get('trackerId').indexOf('vwt') > -1){
          this.mapService.activeTokenId = params.get('trackerId').replace(/-/g, '/');
        } else{
          this.mapService.activeTokenId = params.get('trackerId');
        }
      } else{
        this.mapService.activeTokenId = '';
      }
    });

    if(!carInfo || carInfo.items.length <= 0){
      this.apiService.apiGetCarsInfo();
    }

    this.mapGetCars();
    this.mapGetWorkItems();

    setInterval(() => {
      this.mapService.geoJsonObjectAll.features = [];
      this.mapService.geoJsonObjectActive.features = [];

      this.mapGetCars();
      this.mapGetWorkItems();
    }, (5 * 60 * 1000));
  }
}
