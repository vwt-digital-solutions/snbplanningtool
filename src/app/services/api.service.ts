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

  postCarInfo(carClass: CarClass): Observable<CarClass> {
    return this.httpClient.post<CarClass>(`${this.env.apiUrl}/cars`, carClass);
  }
}
