import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

import { CarInfo } from '../../classes/car-info';

import { ApiService } from 'src/app/services/api.service';
import { CarsInfoService } from 'src/app/services/cars-info.service';

@Component({
  selector: 'app-cars-info-form',
  templateUrl: './cars-info-form.component.html',
  styleUrls: ['./cars-info-form.component.scss']
})
export class CarsInfoFormComponent implements OnInit {
  title: string = 'Add a new car';
  titleEmpty: string = 'There are no unassigned tokens. Please try again later.';
  buttonSave: string = 'Save';

  carsTokens = [];

  model = new CarInfo(null, '', '', null);

  constructor(
    private apiService: ApiService,
    private carsInfoService: CarsInfoService
  ) { }

  ngOnInit() {
    this.apiService.getCarsTokens().subscribe(
      result => {
        for (var property in result) {
          var lastSlash = result[property].lastIndexOf("/");
          var label = result[property].substring(lastSlash + 1);
          var token = result[property];

          this.carsTokens.push({label: label, value: token});
        }
        localStorage.setItem('carTokens', JSON.stringify(this.carsTokens));
      },
      error => this.handleError(error)
    );
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
