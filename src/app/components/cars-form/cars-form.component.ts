import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

import { CarClass } from 'src/app/classes/car-class';

import { ApiService } from 'src/app/services/api.service';
import { CarsService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss']
})
export class CarsFormComponent implements OnInit {
  title = 'Add a new car';
  titleEmpty = 'There are no unassigned tokens. Please try again later.';
  valueFormat = 'Including dashes (e.g. <strong>99-XXX-9</strong> or <strong>9-XXX-99</strong>)';
  buttonSave = 'Save';

  carsTokens: object;

  model = new CarClass(null, '', '', null);

  constructor(
    private apiService: ApiService,
    private carsService: CarsService
  ) { }

  ngOnInit() {
    this.apiService.apiGetTokens();
    this.carsTokens = JSON.parse(localStorage.getItem('carTokens'));
  }

  onSubmit() {
    const that = this;

    delete this.model.id;
    this.model.license_plate = this.model.license_plate.toUpperCase();
    this.buttonSave = 'Saving <i class="fas fa-sync-alt fa-spin"></i>';

    this.apiService.postCarInfo(this.model).subscribe(
      result => {
        that.model.id = Number((result as any)._carinfo_id);
        that.carsService.gridOptions.api.updateRowData({add: [that.model]});

        const oldRows = JSON.parse(localStorage.getItem('carInfo'));
        oldRows.items.push(that.model);
        localStorage.setItem('carInfo', JSON.stringify(oldRows));

        this.buttonSave = 'Saved <i class="fas fa-check"></i>';
        setTimeout(() => {
          that.carsService.isHidden = true;
        }, 2000);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  }
}
