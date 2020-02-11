import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import {AuthRoleService} from './auth-role.service';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CarProviderService {

  loading = new Subject<boolean>();

  carsLocations = new Subject<any[]>();
  carsInfo = new Subject<any[]>();
  tokens = new Subject<any []>();

  constructor(public authRoleService: AuthRoleService,
              private apiService: ApiService) {
    this.loading.next(true);

    this.apiService.apiGetCarsInfo();

    this.apiService.apiGetTokens();

  }



}






