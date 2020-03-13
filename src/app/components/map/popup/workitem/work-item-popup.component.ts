import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PopUpComponent} from '../popup';
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

  public start_time: [string, string];
  public end_time: [string, string];
  public resolve_before_time: [string, string];
  public SLA = {
    days: null,
    onTime: false
  };

  public linkedCar;
  public linkedCarLocation;
  public linkedCarToken;


  public nearbyCars = null;

  public shouldShowNearbyCars = true;
  public loadingNearbyCars = false;
  public nearbyCarsError = false;

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

    const that = this;

    if ('start_timestamp' in this.properties) {
      const momentDate = moment(this.properties.start_timestamp);
      this.start_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('end_timestamp' in this.properties) {
      const momentDate = moment(this.properties.end_timestamp);
      this.end_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : ['-', '-'];
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

        this.resolve_before_time = [resolveBeforeDate.format('DD-MM-YYYY'), resolveBeforeDate.format('HH:mm')];
      } else {
        this.resolve_before_time = ['-', '-'];
      }
    }

    if (this.properties.employee_number) {
      this.linkedCar = this.carProviderService.getCarWithEmployeeNumber(this.properties.employee_number);

      if (this.linkedCar) {
        this.linkedCarLocation = this.carProviderService.getCarLocationForToken(this.linkedCar.token);
      }
    }
  }
}
