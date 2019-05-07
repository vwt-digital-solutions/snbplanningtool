import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';

import { ApiService } from 'src/app/services/api.service';
import { CarsService } from 'src/app/services/cars.service';
import { CarClass } from 'src/app/classes/car-class';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
@NgModule({
  imports: [
    CommonModule
  ]
})
export class CarsComponent {
  title: string = 'Car info';
  buttonRevert: string = 'Revert all changes';
  buttonExport: string = 'Export to Excel';
  buttonNewRow: string = 'Add new row';
  buttonSave: string = 'Save changes';
  buttonSaveInner: string = 'Save <i class="fas fa-save"></i>';

  editedColumnsActive: boolean = false;
  editedColumns = [];

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService,
    public carsService: CarsService
  ) { }

  onBtRefresh(){
    try{
      var carInfo = JSON.parse(localStorage.getItem('carInfo'));
      this.carsService.gridOptions.api.setRowData(carInfo.items);
      this.editedColumnsActive = false;
    } catch(err){
      this.handleError(err);
    }
  }
  onBtExport(){
    this.carsService.gridOptions.api.exportDataAsExcel();
  }
  onBtSave(){
    let that = this;
    this.buttonSaveInner = 'Saving <i class="fas fa-sync-alt fa-spin"></i>';

    this.editedColumns.forEach(function(item){
      that.apiService.postCarInfo(item).subscribe(
        result => {
          var newRow = [],
            carInfo = JSON.parse(localStorage.getItem('carInfo'));

          for (let i = 0; i < that.editedColumns.length; i++) {
            if(that.editedColumns[i] && that.editedColumns[i].id == result['carinfo_id']){
              newRow = that.editedColumns[i];
              that.editedColumns.splice(i, 1);
            }
          }

          for (let i = 0; i < carInfo.items.length; i++) {
            if(carInfo.items[i].id == newRow['id']){
              carInfo.items[i] = newRow;
            }
          }
          localStorage.setItem('carInfo', JSON.stringify(carInfo));

          that.onBtSaveSuccess();
        }, error => this.handleError(error)
      )
    });
  }
  onBtSaveSuccess(){
    if(this.editedColumns.length <= 0){
      let that = this;
      this.buttonSaveInner = 'Saved <i class="fas fa-check"></i>';
      setTimeout(function(){
        that.buttonSaveInner = 'Save';
        that.editedColumnsActive = false;
      }, 2000);
    }
  }
  onCellValueChanged(row) {
    if(row.oldValue != row.newValue){
      var isExisting = false;

      if(row.colDef.field == 'token'){
        var carTokens = (JSON.parse(localStorage.getItem('carTokens')) ? JSON.parse(localStorage.getItem('carTokens')) : null);

        for (let i = 0; i < carTokens.items.length; i++) {
          if(carTokens.items[i] == row.newValue){
            carTokens.items.splice(i, 1);
          }
        }

        carTokens.items.push(row.oldValue);
        localStorage.setItem('carTokens', JSON.stringify(carTokens));
      }

      this.editedColumns.forEach(function(item){
        if(item.id == row['data']['id']){
          item = row['data'];
          isExisting = true;
        }
      })

      if(!isExisting){
        this.editedColumns.push(row['data']);
      }
      this.editedColumnsActive = (this.editedColumns.length > 0 ? true : false);
    }
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

    if(sessionStorage.getItem('changedColumns')){
      sessionStorage.removeItem('changedColumns');
    }

    if(!isLocalStorage && this.authRoleService.isAuthorized){
      this.apiService.apiGet('/carsinfo').subscribe(
        result => {
          var rowData = [],
            newCarInfo = new Object();

          for (let row in result) {
            var data = result[row];
            rowData.push(new CarClass(data.id, data.license_plate, data.driver_name, data.token));
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
