import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { EnvService } from './env.service';
import { CarClass } from '../classes/car-class';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private env: EnvService
  ) {}

  public apiGet(url: string) {
    const requestUrl = this.env.apiUrl + url;
    return this.httpClient.get(requestUrl);
  }

  public apiGetCarsInfo() {
    this.apiGet('/carsinfo').subscribe(
      result => {
        const rowData = [];
        const newCarInfo = new Object();

        for (const row in result) {
          if (result.hasOwnProperty(row)) {
            const data = result[row];
            rowData.push(new CarClass(data.id, data.license_plate, data.driver_name, data.driver_skill, data.token));
          }
        }

        (newCarInfo as any).items = rowData;
        (newCarInfo as any).lastUpdated = new Date().getTime();
        localStorage.setItem('carInfo', JSON.stringify(newCarInfo));

        return newCarInfo;
      },
      error => {
        return throwError(error);
      }
    );
  }

  public apiGetTokens() {
    const requestUrl = this.env.apiUrl + '/tokens';

    return this.httpClient.get(requestUrl).subscribe(
      result => {
        const newCarTokens = new Object();
        (newCarTokens as any).items = result;
        (newCarTokens as any).lastUpdated = new Date().getTime();

        localStorage.setItem('carTokens', JSON.stringify(newCarTokens));
      },
      error => {
        return throwError(error);
      }
    );
  }

  postCarInfo(carClass: CarClass): Observable<CarClass> {
    return this.httpClient.post<CarClass>(`${this.env.apiUrl}/carsinfo`, carClass);
  }
}
