import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  public apiGet(url: string): Observable<any> {
    const requestUrl = this.env.apiUrl + url;
    return this.httpClient.get(requestUrl);
  }

  postCarInfo(carClass: Car): Observable<Car> {
    return this.httpClient.post<Car>(`${this.env.apiUrl}/cars`, carClass);
  }
}
