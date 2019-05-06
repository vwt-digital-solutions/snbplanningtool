import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

import { CarInfo } from '../../classes/car-info';

import { ApiService } from 'src/app/services/api.service';
import { CarsInfoService } from 'src/app/services/cars-info.service';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss']
})
export class CarsFormComponent implements OnInit {
  title: string = 'Add a new car';
  titleEmpty: string = 'There are no unassigned tokens. Please try again later.';
  valueFormat: string = 'Including dashes (e.g. <strong>99-XXX-9</strong> or <strong>9-XXX-99</strong>)'
  buttonSave: string = 'Save';

  carsTokens: Object;

  model = new CarInfo(null, '', '', null);

  constructor(
    private apiService: ApiService,
    private carsInfoService: CarsInfoService
  ) { }

  ngOnInit() {
    this.apiService.apiGetTokens();
    this.carsTokens = JSON.parse(localStorage.getItem('carTokens'));
  }

  onSubmit() {
    let that = this;

    delete this.model.id;
    this.model.license_plate = this.model.license_plate.toUpperCase();
    this.buttonSave = 'Saving <i class="fas fa-sync-alt fa-spin"></i>';

    this.apiService.postCarInfo(this.model).subscribe(
      result => {
        that.model.id = Number(result['carinfo_id']);
        that.carsInfoService.gridOptions.api.updateRowData({add: [that.model]});

        var oldRows = JSON.parse(localStorage.getItem('carInfo'));
        oldRows.items.push(that.model);
        localStorage.setItem('carInfo', JSON.stringify(oldRows));

        this.buttonSave = 'Saved <i class="fas fa-check"></i>';
        setTimeout(function(){
          that.carsInfoService.isHidden = true;
        }, 2000);
      },
      error => this.handleError(error)
    )
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
