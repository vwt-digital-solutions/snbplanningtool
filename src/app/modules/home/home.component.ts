import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError, Observable } from 'rxjs';

import { MapService } from 'src/app/services/map.service';
import { WorkItemProviderService } from 'src/app/services/work-item-provider.service';
import { CarProviderService } from '../../services/car-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  @HostBinding('class.home-component') true;

  constructor(
    private route: ActivatedRoute,
    public mapService: MapService,
    private workItemProviderService: WorkItemProviderService,
    private carProviderService: CarProviderService
  ) {
    this.workItemProviderService.loadingSubject.subscribe(value => {
      this.mapService.geoJsonReady.work = !value;

      if (this.mapService.geoJsonReady.cars && this.mapService.geoJsonReady.work) {
        this.mapService.geoJsonReady.map = true;
      }
    });

    this.carProviderService.loadingSubject.subscribe(value => {
      this.mapService.geoJsonReady.cars = !value;

      if (this.mapService.geoJsonReady.cars && this.mapService.geoJsonReady.work) {
        this.mapService.geoJsonReady.map = true;
      }
    });

    this.workItemProviderService.errorSubject.subscribe(error => {
      this.handleError(error);
    });
  }


  // API CALLS
  private handleError(error): Observable<any> {
    if (error.status !== 403) {
      this.mapService.refreshStatusClass = true;
      this.mapService.refreshStatus = 'Er is een fout opgetreden';
      return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
    }
  }
  // END API CALLS


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.trackerId) {
        if (params.trackerId.indexOf('vwt') > -1) {
          this.mapService.activeTokenId.next(params.trackerId.replace(/-/g, '/'));
        } else {
          this.mapService.activeTokenId.next(params.trackerId);
        }
      } else {
        this.mapService.activeTokenId.next('');
      }
    });
  }
}
