import { Component } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';

import { throwError } from 'rxjs';
import { CarInfo } from 'src/app/classes/car-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(
    private oauthService: OAuthService,
    private apiService: ApiService,
    private mapService: MapService
  ) {}

  ngOnInit(){
    if(this.oauthService.hasValidIdToken()) {
      this.apiService.getCars().subscribe(
        result => {
          this.handleResult(result);
          setInterval(() => {
            this.refreshData()
          }, (5 * 60 * 1000));
        },
        error => this.handleError(error)
      );
    }

    if(!localStorage.getItem('carInfo')){
      this.apiService.getCarsInfo().subscribe(
        result => {
          var rowData = [],
            newCarInfo = new Object();

          for (let row in result) {
            var data = result[row];
            rowData.push(new CarInfo(data.id, data.license_plate, data.driver_name, data.token));
          }

          newCarInfo['items'] = rowData;
          newCarInfo['lastUpdated'] = new Date().getTime();
          localStorage.setItem('carInfo', JSON.stringify(newCarInfo));
        },
        error => this.handleError(error)
      );
    }
  }

  refreshData(){
    this.apiService.updateData().subscribe(
      result => this.handleResult(result),
      error => this.handleError(error)
    );
  }

  private handleResult(result) {
    if(localStorage.getItem('carInfo')){
      var carInfo = JSON.parse(localStorage.getItem('carInfo'));

      if(carInfo){
        for (let i = 0; i < result.features.length; i++) {
          for (let j = 0; j < carInfo.items.length; j++) {
            if(carInfo.items[j].token == result.features[i].properties.token){
              result.features[i].properties.driver_name = (carInfo.items[j].driver_name ? carInfo.items[j].driver_name : '');
              result.features[i].properties.license_plate = (carInfo.items[j].license_plate ? carInfo.items[j].license_plate : '');
            }
          }
        }
      } else{
        localStorage.removeItem('carInfo');
      }
    }

    this.mapService.geoJsonObject = result;
    this.mapService.refreshUpdate = Date.now();
  };

  private handleError(error) {
    this.mapService.refreshStatusClass = true;
    this.mapService.refreshStatus = 'An error has occurred';
    return throwError('Something bad happened, please try again later.');
  };
}
