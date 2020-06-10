import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {interval, Observable, of, throwError} from 'rxjs';
import {flatMap, retryWhen} from 'rxjs/operators';

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

  private retry(maxRetry = 2, delayMs = 1000): any {
    return (src: Observable<any>) => src.pipe(
      retryWhen(_ => {
        return interval(delayMs).pipe(
          flatMap(count => count === maxRetry ? throwError('Max retries reached with no success') : of(count))
        );
      })
    );
  }

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  public apiGet(url: string): Observable<any> {
    const requestUrl = this.env.apiUrl + url;
    return this.httpClient.get(requestUrl);
  }

  postCarInfo(engineer): Observable<Engineer> {
    return this.httpClient.post<Engineer>(`${this.env.apiUrl}/engineers`, engineer);
  }

  getMapConfig(): Observable<any> {
    return this.httpClient.get<any>(this.env.apiUrl + '/map-configurations').pipe(this.retry());
  }
}
