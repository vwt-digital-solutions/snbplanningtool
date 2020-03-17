import { Injectable } from '@angular/core';

import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {AuthRoleService} from './auth-role.service';
import {ApiService} from './api.service';
import {Car} from '../classes/car';

import {map} from 'rxjs/internal/operators';
import CarLocation from '../classes/car-location';

@Injectable({
  providedIn: 'root'
})
export class CarProviderService {

  loadingSubject = new Subject<boolean>();
  savingSubject = new Subject<boolean>();
  errorSubject = new Subject<any>();

  carsLocationsSubject = new BehaviorSubject<any[]>([]);
  carsInfoSubject = new BehaviorSubject<any[]>([]);
  carsTokenSubject = new BehaviorSubject<any[]>([]);
  tokensSubject = new BehaviorSubject<any []>([]);

  constructor(public authRoleService: AuthRoleService,
              private apiService: ApiService) {

    setTimeout(() => {
      this.getCars();
      this.getTokens();
      this.getCarLocations();
    }, 200);


    this.carsInfoSubject.subscribe((value) => this.updateCarLocations());
    this.carsTokenSubject.subscribe((value) => this.updateCarLocations());

    setInterval(() => {
      this.getCarLocations();
    }, (5 * 60 * 1000));

  }

  ////
  // API methods
  ////

  public getCars() {
    if (localStorage.getItem('carInfo')) {
      const carInfo = JSON.parse(localStorage.getItem('carInfo'));

      if ((carInfo as any).lastUpdated >= (new Date().getTime() - (30 * 60 * 1000))
        && (carInfo as any).items.length > 0) {
        this.carsInfoSubject.next((carInfo as any).items);
        return;
      }
    }

    this.apiService.apiGet('/cars').subscribe(
      result => {
        const carInfoItems = [];

        for (const property in result) {
          if (result.hasOwnProperty(property)) {
            const carInfo = result[property];
            carInfoItems.push(new Car(
              carInfo.id,
              carInfo.license_plate,
              carInfo.driver_name,
              carInfo.driver_skill,
              carInfo.driver_employee_number,
              carInfo.administration,
              carInfo.token
            ));
          }
        }

        const newCarInfo = {
          items: carInfoItems,
          lastUpdated: new Date().getTime()
        };

        localStorage.setItem('carInfo', JSON.stringify(newCarInfo));
        this.carsInfoSubject.next(carInfoItems);
        this.loadingSubject.next(false);

        return newCarInfo;
      },
      error => {
        this.errorSubject.next(error);
      }
    );
  }

  public getTokens() {

    const carTokens = (JSON.parse(localStorage.getItem('carTokens'))
      ? JSON.parse(localStorage.getItem('carTokens')) : null);

    if (carTokens && carTokens.items && carTokens.items.length > 0) {
      this.tokensSubject.next(carTokens.items);
      return;
    }

    this.apiService.apiGet('/tokens').subscribe(
      result => {
        const newCarTokens = new Object();
        (newCarTokens as any).items = result;
        (newCarTokens as any).lastUpdated = new Date().getTime();
        localStorage.setItem('carTokens', JSON.stringify(newCarTokens));


        this.tokensSubject.next(result as [any]);
      },
      error => {
        return throwError(error);
      }
    );

  }

  public getCarLocations() {
    this.loadingSubject.next(true);

    this.apiService.apiGet('/cars/locations').subscribe(
      (result: any) => {

        const featuresList: [any] = result.features;

        this.loadingSubject.next(false);
        this.carsTokenSubject.next(featuresList);
      },
      error => {
        this.errorSubject.next(error);
        this.loadingSubject.next(false);
      }
    );
  }

  public getCarDistances(workItem: string) {

    return this.apiService.apiGet('/cars/distances?work_item=' + workItem).pipe(
      map((result: any) => {
          for (const item of result.items) {
            item.carLocation = this.getCarLocationForToken(item.token);
          }

          return result.items;
        }
      ));
  }

  public postCarInfo(items: any[]) {
    this.savingSubject.next(true);

    items.forEach((item) => {
      const newItem = item.id == null;

      if (item.driver_skill == null) {
        item.driver_skill = '';
      }
      if (item.driver_employee_number == null) {
        item.driver_employee_number = '';
      }

      this.apiService.postCarInfo(item).subscribe(
        result => {
          let newRow = [];
          const carInfo = this.carsInfoSubject.value;

          if (newItem) {
            item.id = (result as any).carinfo_id;
            carInfo.push(item);
          } else {
            for (let i = 0; i < items.length; i++) {
              if (items[i] && items[i].id === (result as any).carinfo_id) {
                newRow = items[i];
                items.splice(i, 1);
              }
            }

            for (let i = 0; i < carInfo.length; i++) {
              if (carInfo[i].id === (newRow as any).id) {
                carInfo[i] = newRow;
              }
            }
          }

          const storedCarInfo = JSON.parse(localStorage.getItem('carInfo'));
          storedCarInfo.items = carInfo;
          localStorage.setItem('carInfo', JSON.stringify(storedCarInfo));


          this.carsInfoSubject.next(carInfo);
          this.savingSubject.next(false);

        }, error => {
          return throwError(error);
          this.errorSubject.next(error);
          this.savingSubject.next(false);
        }
      );
    });
  }

  ////
  // Subject methods
  ////

  public updateCarLocations() {
    const featuresList = this.carsTokenSubject.value || [];
    const carInfo = this.carsInfoSubject.value || [];

    const carLocations = [];

    for (const feature of featuresList) {
      const carLocation = new CarLocation({} as Car, feature.properties.token, feature.geometry);
      for (const item of carInfo) {
        if (item.token === feature.properties.token) {
          carLocation.car = item;
        }
      }
      carLocations.push(carLocation);
    }

    this.carsLocationsSubject.next(carLocations);
  }

  ////
  // Search methods
  ////

  public getCarWithEmployeeNumber(employeeNumber: string) {
    return this.carsInfoSubject.value.filter(carInfo => carInfo.driver_employee_number === employeeNumber)[0];
  }

  public getCarLocationForToken(token: string) {
    if (!token) {
      return null;
    }

    return this.carsLocationsSubject.value.filter(carLocation => carLocation.token === token)[0];
  }

}
