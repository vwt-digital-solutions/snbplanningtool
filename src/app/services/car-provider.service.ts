import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/internal/operators';

import { BehaviorSubject, Subject, throwError, Observable } from 'rxjs';
import { AuthRoleService } from './auth-role.service';
import { ApiService } from './api.service';
import { QueryParameterService } from './query-parameter.service';
import { Engineer } from '../classes/engineer';

import { ChoiceFilter, ChoiceFilterType } from '../modules/filters/filters/filters';
import { FilterMap } from '../modules/filters/filter-map';

import CarLocation from '../classes/car-location';
import Token from '../classes/token';

@Injectable({
  providedIn: 'root'
})
export class CarProviderService {
  rawCarItems: any[]  = [];
  filteredCarItems: any[] = [];

  loadingSubject = new Subject<boolean>();
  savingSubject = new Subject<boolean>();
  errorSubject = new Subject<any>();

  // Internal subject used to generate
  private carsTokenSubject = new BehaviorSubject<any[]>([]);

  public carsLocationsSubject = new BehaviorSubject<CarLocation[]>([]);
  public carsInfoSubject = new BehaviorSubject<Engineer[]>([]);

  public tokensSubject = new BehaviorSubject<Token[]>([]);

  public filterService = new FilterMap(
    [
      new ChoiceFilter(
        'engineer',
        'Administratie (klantteam)',
        'engineer.administration',
        ChoiceFilterType.multiple
      )
    ]
  );

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService,
    private queryParameterService: QueryParameterService
  ) {
    this.filterService.filterChanged.subscribe(value => {
      this.queryParameterService.setRouteParams(value);
      this.filter(this.rawCarItems);
    });

    setTimeout(() => {
      this.getCars();
      this.getTokens();
      this.getCarLocations();
    }, 200);

    // Only take 2 subscriptions the initial empty route and the routeparams that are initialised later.
    this.queryParameterService.route.queryParams.pipe(take(2)).subscribe(params => {
      this.filterService.setFilterValues(params);
    });

    this.carsInfoSubject.subscribe(() => this.updateCarLocations());
    this.carsTokenSubject.subscribe(() => this.updateCarLocations());

    setInterval(() => {
      this.getCarLocations();
    }, (5 * 60 * 1000));
  }

  ////
  // API methods
  ////

  public getCars(): void {
    if (localStorage.getItem('engineer')) {
      const engineer: any = JSON.parse(localStorage.getItem('engineer'));

      if (engineer.lastUpdated >= (new Date().getTime() - (30 * 60 * 1000))
        && engineer.items.length > 0) {
        this.carsInfoSubject.next(engineer.items);
        return;
      }
    }

    this.apiService.apiGet('/engineers').subscribe(
      (result) => {
        const engineerItems = result.items.map(engineer => {
          return Engineer.fromRaw(engineer._embedded.engineer);
        });

        const newCarInfo = {
          items: engineerItems,
          lastUpdated: new Date().getTime()
        };

        localStorage.setItem('engineer', JSON.stringify(newCarInfo));
        this.carsInfoSubject.next(engineerItems);
        this.loadingSubject.next(false);

        return newCarInfo;
      },
      error => {
        this.errorSubject.next(error);
      }
    );
  }

  public getTokens(): void | Observable<any> {
    const carTokens = (JSON.parse(localStorage.getItem('carTokens'))
      ? JSON.parse(localStorage.getItem('carTokens')) : null);

    if (carTokens && carTokens.items && carTokens.items.length > 0) {
      this.tokensSubject.next(carTokens.items);
      return;
    }

    this.apiService.apiGet('/tokens?assigned=false').subscribe(
      result => {
        const newCarTokens: any = new Object();
        newCarTokens.items = result.items;
        newCarTokens.lastUpdated = new Date().getTime();
        localStorage.setItem('carTokens', JSON.stringify(newCarTokens));

        this.tokensSubject.next(result as Token[]);
      },
      error => {
        return throwError(error);
      }
    );

  }

  public getCarLocations(): void {
    this.loadingSubject.next(true);

    this.apiService.apiGet('/locations/cars').subscribe(
      result => {
        const featuresList = result.features;

        this.loadingSubject.next(false);
        this.carsTokenSubject.next(featuresList);
      },
      error => {
        this.errorSubject.next(error);
        this.loadingSubject.next(false);
      }
    );
  }

  public getCarDistances(workItem: string, cars: string[] = null): Observable<Engineer> {

    let url = '/workitems/' + workItem + '/distances';
    if (cars) {
      url = url + '?engineers=' + cars.join(',');
    }

    return this.apiService.apiGet(url).pipe(
      map(result => {
          for (const item of result.items) {
            item.carLocation = this.getCarLocationForToken(item.token);
          }

          return result.items;
        }
      ));
  }

  public postCarInfo(items: Engineer[]): void {
    this.savingSubject.next(true);

    items.forEach((item) => {
      const newItem = item.id == null;

      // Clone the item, because we need to remove some fields before posting to the API,
      // like removing the licensePlate.
      const postInfo = Engineer.toRaw(item);

      this.apiService.postCarInfo(postInfo).subscribe(
        result => {
          let newRow: Engineer;
          const engineer = this.carsInfoSubject.value;

          if (newItem) {
            item = result;
            engineer.push(item);
            this.assignToken(item.id);
          } else {
            for (let i = 0; i < items.length; i++) {
              if (items[i] && items[i].id === result.id) {
                newRow = items[i];
                items.splice(i, 1);
              }
            }

            for (let i = 0; i < engineer.length; i++) {
              if (engineer[i].id === newRow.id) {
                engineer[i] = newRow;
              }
            }
          }

          const storedCarInfo = JSON.parse(localStorage.getItem('engineer'));
          storedCarInfo.items = engineer;
          localStorage.setItem('engineer', JSON.stringify(storedCarInfo));


          this.carsInfoSubject.next(engineer);
          this.savingSubject.next(false);

        }
      );
    });
  }

  ////
  // Subject methods
  ////

  public updateCarLocations(): void {
    const featuresList = this.carsTokenSubject.value || [];
    const engineer = this.carsInfoSubject.value || [];

    const carLocations: CarLocation[] = [];

    featuresList.forEach(feature => {
      const carLocation = new CarLocation({} as Engineer, feature.properties.token, feature.geometry);
      engineer.forEach(item => {
        if (item.token === feature.properties.token) {
          carLocation.engineer = item;
        }
      });

      carLocations.push(carLocation);
    });

    this.rawCarItems = carLocations;
    this.filter(this.rawCarItems);
  }

  public assignToken(token: string): void {
    const carTokens = (JSON.parse(localStorage.getItem('carTokens'))
      ? JSON.parse(localStorage.getItem('carTokens')) : null);

    carTokens.items = carTokens.items.filter((obj: Token) => obj.id !== token);

    localStorage.setItem('carTokens', JSON.stringify(carTokens));

    this.tokensSubject.next(carTokens.items as Token[]);
  }

  ////
  // Search methods
  ////

  public getCarWithEngineer(employeeNumber: string): Engineer {
    return this.carsInfoSubject.value.filter(engineer => engineer.employeeNumber === employeeNumber)[0];
  }

  public getCarLocationForToken(token: string): CarLocation {
    if (!token) {
      return null;
    }

    return this.carsLocationsSubject.value.filter(carLocation => carLocation.token === token)[0];
  }

  private filter(listToFilter: Engineer[]): void {
    this.filteredCarItems = this.filterService.filterList(listToFilter);
    this.carsLocationsSubject.next(this.filteredCarItems);
  }
}
