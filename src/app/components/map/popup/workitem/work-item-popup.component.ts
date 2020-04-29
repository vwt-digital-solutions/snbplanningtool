import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PopUpComponent} from '../popup';
import {CustomLayer} from '../../../../models/layer';

import {MapService} from '../../../../services/map.service';
import {CarProviderService} from '../../../../services/car-provider.service';

import * as moment from 'moment';


@Component({
  selector: 'app-work-item-popup',
  templateUrl: './work-item-popup.component.html',
  styleUrls: ['./work-item-popup.component.scss']
})
export class WorkItemPopupComponent extends PopUpComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private carProviderService: CarProviderService,
    private changeDectectorRef: ChangeDetectorRef
  ) {
    super();
  }

  public start_time: [string, string]; // eslint-disable-line @typescript-eslint/camelcase
  public end_time: [string, string]; // eslint-disable-line @typescript-eslint/camelcase
  public resolve_before_time: [string, string]; // eslint-disable-line @typescript-eslint/camelcase
  public SLA = {
    days: null,
    onTime: false
  };

  public linkedCar;
  public linkedCarLocation;
  public linkedCarDistance;


  public loadingLinkedCarDistance = false;
  public linkedCarDistanceError = false;


  public nearbyCars = null;

  public shouldShowNearbyCars = true;
  public loadingNearbyCars = false;
  public nearbyCarsError = false;

  public downloadLinkedCarDistance() {
    this.loadingLinkedCarDistance = true;
    this.changeDectectorRef.detectChanges();

    this.carProviderService.getCarDistances(this.properties.l2_guid, [this.linkedCar.token])
      .subscribe(result => {
        this.linkedCarDistance = result[0];
        this.loadingLinkedCarDistance = false;
        this.changeDectectorRef.detectChanges();
      }, error => {
        this.linkedCarDistanceError = true;
        this.loadingLinkedCarDistance = false;
        this.changeDectectorRef.detectChanges();
      });

  }

  public downloadNearbyCars() {
    this.loadingNearbyCars = true;
    this.changeDectectorRef.detectChanges();

    this.carProviderService.getCarDistances(this.properties.l2_guid).subscribe(result => {
      this.nearbyCars = result;
      this.loadingNearbyCars = false;
      this.changeDectectorRef.detectChanges();

    }, error => {
      this.nearbyCarsError = true;
      this.loadingNearbyCars = false;
      this.changeDectectorRef.detectChanges();
    });


  }

  ngOnInit() {
    if ('start_timestamp' in this.properties) {
      const momentDate = moment(this.properties.start_timestamp);
      this.start_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), // eslint-disable-line @typescript-eslint/camelcase
        momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('end_timestamp' in this.properties) {
      const momentDate = moment(this.properties.end_timestamp);
      this.end_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), // eslint-disable-line @typescript-eslint/camelcase
        momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('end_timestamp' in this.properties) {
      const resolveBeforeDate = moment(this.properties.resolve_before_timestamp);

      if (resolveBeforeDate.isValid() && this.properties.end_timestamp != null) {
        const endDate = moment(this.properties.end_timestamp);
        const daysUntilSLA = Math.abs(Math.round(endDate.diff(resolveBeforeDate, 'days', true)));

        if (endDate.isAfter(resolveBeforeDate)) {
          this.SLA = {
            onTime: false,
            days: daysUntilSLA
          };
        } else {
          this.SLA.onTime = true;
        }

        this.resolve_before_time = [resolveBeforeDate.format('DD-MM-YYYY'), // eslint-disable-line @typescript-eslint/camelcase
          resolveBeforeDate.format('HH:mm')];
      } else {
        this.resolve_before_time = ['-', '-']; // eslint-disable-line @typescript-eslint/camelcase
      }
    }

    if (this.properties.employee_number) {
      this.linkedCar = this.carProviderService.getCarWithEmployeeNumber(this.properties.employee_number);

      if (this.linkedCar) {
        this.linkedCarLocation = this.carProviderService.getCarLocationForToken(this.linkedCar.token);
      }
    }
  }

  public showNearbyCarAsCustomLayer() {
    const title = 'Auto\'s dichtbij werkitem ' + this.properties.l2_guid;
    const items = this.nearbyCars.map(carDistance => carDistance.carLocation);
    items.push(this.properties);
    const customLayer = new CustomLayer(title, items);
    this.mapService.addCustomLayer(customLayer);
  }

  public showLinkedCarAsCustomLayer() {
    const title = 'Afstand monteur ' + this.linkedCar.driver_name + ' en werkitem ' + this.properties.l2_guid;
    const items = [this.linkedCarLocation, this.properties];

    const customLayer = new CustomLayer(title, items, true);
    this.mapService.addCustomLayer(customLayer);
  }
}
