import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { EnvService } from './env.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CarInfo } from '../classes/car-info';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private oauthService: OAuthService
  ) {}

  public getCars(){
    if(this.env.apiUrl && this.oauthService.getAccessToken()){
      return this.httpClient.get(`${this.env.apiUrl}/cars`, {
        headers: new HttpHeaders().set('Authorization',  `Bearer ${this.oauthService.getAccessToken()}`)
      });
    } else{
      return throwError('Something bad happened, please try again later.');
    }
  }


  public getCarsInfo(){
    if(this.env.apiUrl && this.oauthService.getAccessToken()){
      return this.httpClient.get(`${this.env.apiUrl}/carsinfo`, {
        headers: new HttpHeaders().set('Authorization',  `Bearer ${this.oauthService.getAccessToken()}`)
      });
    } else{
      return throwError('Something bad happened, please try again later.');
    }
  }

  postCarInfo (carInfo: CarInfo): Observable<CarInfo> {
    if(this.env.apiUrl && this.oauthService.getAccessToken()){
      return this.httpClient.post<CarInfo>(`${this.env.apiUrl}/carsinfo`, carInfo, {
        headers: new HttpHeaders().set('Authorization',  `Bearer ${this.oauthService.getAccessToken()}`)
      });
    } else{
      return throwError('Something bad happened, please try again later.');
    }
  }


  public getCarsTokens(){
    if(this.env.apiUrl && this.oauthService.getAccessToken()){
      return this.httpClient.get(`${this.env.apiUrl}/tokens`, {
        headers: new HttpHeaders().set('Authorization',  `Bearer ${this.oauthService.getAccessToken()}`)
      });
    } else{
      return throwError('Something bad happened, please try again later.');
    }
  }


  public updateData(){
    return this.getCars();
  }
}
