import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {PopUpComponent} from '../popup';
import {MapService} from '../../../../services/map.service';

@Component({
  selector: 'app-work-item-popup',
  templateUrl: './work-item-popup.component.html',
  styleUrls: ['./work-item-popup.component.scss']
})
export class WorkItemPopupComponent extends PopUpComponent implements OnInit {
  constructor(private mapService: MapService) {
    super();
  }

  public start_time: [string, string];
  public end_time: [string, string];
  public resolve_before_time: [string, string];

  public linkedCar;

  ngOnInit() {
    if ('start_timestamp' in this.properties) {
      const momentDate = moment(this.properties.start_timestamp);
      this.start_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('end_timestamp' in this.properties) {
      const momentDate = moment(this.properties.end_timestamp);
      this.end_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('end_timestamp' in this.properties) {
      const momentDate = moment(this.properties.resolve_before_timestamp);
      this.resolve_before_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : ['-', '-'];
    }

    if ('driver_employee_number' in this.properties) {
      this.linkedCar = JSON.parse(localStorage.getItem('carInfo'))[0];
    }
  }



}
