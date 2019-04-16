import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private env: EnvService
  ) {}

  private handleError(error: HttpErrorResponse) {
    return throwError('Something bad happened, please try again later.');
  };

  public getCars(){
    if(this.env.apiUrl){
      return this.httpClient.get(`${this.env.apiUrl}/cars`);
    } else{
      return throwError('Something bad happened, please try again later.');
    }
  }

  public updateData(){
    return this.getCars();
  }
}
