import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { EnvService } from './env.service';
import { CarInfo } from '../classes/car-info';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private env: EnvService
  ) {}

  public apiGet(url: string){
    var requestUrl = this.env.apiUrl + url;
    return this.httpClient.get(requestUrl);
  }

  public apiGetCarsInfo(){
    var requestUrl = this.env.apiUrl + '/carsinfo';
    this.httpClient.get(requestUrl).subscribe(
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

        return newCarInfo;
      },
      error => {
        return throwError(error)
      }
    );
  }

  public apiGetTokens(){
    var requestUrl = this.env.apiUrl + '/tokens',
      response: Object;

    return this.httpClient.get(requestUrl).subscribe(
      result => {
        var newCarTokens = new Object();
        newCarTokens['items'] = result;
        newCarTokens['lastUpdated'] = new Date().getTime();

        localStorage.setItem('carTokens', JSON.stringify(newCarTokens));
      },
      error => {
        return throwError(error)
      }
    );
  }

  postCarInfo (carInfo: CarInfo): Observable<CarInfo> {
    return this.httpClient.post<CarInfo>(`${this.env.apiUrl}/carsinfo`, carInfo);
  }
}
