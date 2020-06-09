import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvService } from './env.service';
import { Engineer } from '../classes/engineer';

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

  postCarInfo(engineer): Observable<Engineer> {
    return this.httpClient.post<Engineer>(`${this.env.apiUrl}/engineers`, engineer);
  }
}
