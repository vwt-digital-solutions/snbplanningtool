import { Component } from '@angular/core';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(
    private authRoleService: AuthRoleService,
    private apiService: ApiService,
    private mapService: MapService
  ) {}

  public mapGetCars(){
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
        this.handleError(error);
      }
    );
  }

  public mapGetWorkItems(){
    let that = this;

    if(this.authRoleService.isAuthorized){
      this.apiService.apiGet('/workitems/all').subscribe(
        result => {
          var workItems = {features: []};
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
              workItems.features.push(newWorkItem);
            }
          }

          this.handleResult(workItems, 'work');
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  ngOnInit(){
    var carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);
    this.mapService.geoJsonObjectAll.features = [];
    this.mapService.geoJsonObjectActive.features = [];

    if(!carInfo){
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

  private handleResult(result, layer) {
    let that = this;
    var carInfo = (localStorage.getItem('carInfo') ? JSON.parse(localStorage.getItem('carInfo')) : null);

    if(carInfo && layer == 'cars'){
      for (let i = 0; i < result.features.length; i++) {
        for (let j = 0; j < carInfo.items.length; j++) {
          if(carInfo.items[j].token == result.features[i].properties.token){
            result.features[i].properties.driver_name = (carInfo.items[j].driver_name ? carInfo.items[j].driver_name : '');
            result.features[i].properties.license_plate = (carInfo.items[j].license_plate ? carInfo.items[j].license_plate : '');
          }
        }
      }
    } else if(!carInfo){
      this.apiService.apiGetTokens();
    }

    result.features.forEach(function(feature){
      that.mapService.geoJsonObjectAll.features.push(feature);

      if(feature.active){
        that.mapService.geoJsonObjectActive.features.push(feature);
      }
    });

    this.mapService.refreshUpdate = Date.now();
  };

  private handleError(error) {
    if(error.status != 403){
      this.mapService.refreshStatusClass = true;
      this.mapService.refreshStatus = 'An error has occurred';
      return throwError('Something bad happened, please try again later.');
    }
  };
}
