import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { EnvService } from './env.service';
import { Car } from '../classes/car';

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

  postCarInfo(carClass: Car): Observable<Car> {
    return this.httpClient.post<Car>(`${this.env.apiUrl}/cars`, carClass);
  }
}
