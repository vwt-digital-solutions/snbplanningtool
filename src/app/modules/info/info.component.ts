import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { CarsInfoService } from 'src/app/services/cars-info.service';
import { CarInfo } from 'src/app/classes/car-info';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
@NgModule({
  imports: [
    CommonModule
  ]
})
export class InfoComponent {
  title: string = 'Car info';
  buttonRevert: string = 'Revert all changes';
  buttonExport: string = 'Export to Excel';
  buttonNewRow: string = 'Add new row';
  buttonSave: string = 'Save changes';

  constructor(
    private apiService: ApiService,
    public carsInfoService: CarsInfoService
  ) { }

  onBtRefresh(){
    try{
      var carInfo = JSON.parse(localStorage.getItem('carInfo'));
      this.carsInfoService.gridOptions.api.setRowData(carInfo.items);
    } catch(err){
      this.handleError(err);
    }
  }
  onBtExport(){
    this.carsInfoService.gridOptions.api.exportDataAsExcel();
  }
  onBtSave(){
    console.log('Saved');
  }

  onGridReady(event: any) {
    let that = this;
    var isLocalStorage: boolean = false;

    if(localStorage.getItem('carInfo')){
      var carInfo = JSON.parse(localStorage.getItem('carInfo'));

      if(carInfo.lastUpdated >= (30 * 60 * 1000)){
        isLocalStorage = true;
      }
    }

    if(!isLocalStorage){
      this.apiService.getCarsInfo().subscribe(
        result => {
          var rowData = [],
            newCarInfo = new Object();

          for (let row in result) {
              var data = result[row]
              rowData.push(new CarInfo(data.id, data.license_plate, data.driver_name, data.token));
          }

          event.api.setRowData(rowData);
          event.api.sizeColumnsToFit();

          newCarInfo['items'] = rowData;
          newCarInfo['lastUpdated'] = new Date().getTime();
          localStorage.setItem('carInfo', JSON.stringify(newCarInfo));
        },
        error => this.handleError(error)
      );
    } else{
      console.log('Local');
      event.api.setRowData(carInfo.items);
      event.api.sizeColumnsToFit();
    }
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
