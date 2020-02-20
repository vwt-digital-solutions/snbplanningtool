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
  title = 'Auto informatie';
  buttonRevert = 'Zet alle wijzigingen terug';
  buttonExport = 'Exporteren naar Excel';
  buttonNewRow = 'Nieuwe rij toevoegen';
  buttonSave = 'Wijzigingen opslaan';
  buttonSaveInner = 'Opslaan <i class="fas fa-save"></i>';

  callProcessing: string;
  editedColumns = [];

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService,
    public carsService: CarsService
  ) { }

  onBtRefresh() {
    try {
      this.apiService.apiGetTokens();
      const carInfo = JSON.parse(localStorage.getItem('carInfo'));
      this.carsService.gridOptions.api.setRowData(carInfo.items);
      this.editedColumns = [];
    } catch (err) {
      this.handleError(err);
    }
  }
  onBtExport() {
    this.carsService.gridOptions.api.exportDataAsExcel();
  }
  onBtSave() {
    const that = this;
    this.buttonSaveInner = 'Opslaan <i class="fas fa-sync-alt fa-spin"></i>';

    this.editedColumns.forEach((item) => {
      if (item.driver_skill == null) {
        item.driver_skill = '';
      }

      that.apiService.postCarInfo(item).subscribe(
        result => {
          let newRow = [];
          const carInfo = JSON.parse(localStorage.getItem('carInfo'));

          for (let i = 0; i < that.editedColumns.length; i++) {
            if (that.editedColumns[i] && that.editedColumns[i].id === (result as any).carinfo_id) {
              newRow = that.editedColumns[i];
              that.editedColumns.splice(i, 1);
            }
          }

          for (let i = 0; i < carInfo.items.length; i++) {
            if (carInfo.items[i].id === (newRow as any).id) {
              carInfo.items[i] = newRow;
            }
          }
          localStorage.setItem('carInfo', JSON.stringify(carInfo));

          that.onBtSaveSuccess();
        }, error => {
          this.handleError(error);
        }
      );
    });
  }
  onBtSaveSuccess() {
    if (this.editedColumns.length <= 0) {
      const that = this;
      this.buttonSaveInner = 'Opgeslagen <i class="fas fa-check"></i>';
      setTimeout(() => {
        that.buttonSaveInner = 'Opslaan';
        that.editedColumns = [];
      }, 2000);
    }
  }
  onCellValueChanged(row) {
    if (row.oldValue !== row.newValue) {
      let isExisting = false;

      if (row.colDef.field === 'token') {
        const carTokens = (JSON.parse(localStorage.getItem('carTokens')) ? JSON.parse(localStorage.getItem('carTokens')) : null);

        for (let i = 0; i < carTokens.items.length; i++) {
          if (carTokens.items[i] === row.newValue) {
            carTokens.items.splice(i, 1);
          }
        }

        carTokens.items.push(row.oldValue);
        localStorage.setItem('carTokens', JSON.stringify(carTokens));
      }

      this.editedColumns.forEach((item) => {
        if (item.id === (row as any).data.id) {
          item = (row as any).data;
          isExisting = true;
        }
      });

      if (!isExisting) {
        this.editedColumns.push((row as any).data);
      }
    }
  }

  onGridReady(event: any) {
    let isLocalStorage = false;
    let carInfo = [];

    this.callProcessing = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';
    this.apiService.apiGetTokens();

    if (localStorage.getItem('carInfo')) {
      carInfo = JSON.parse(localStorage.getItem('carInfo'));

      if ((carInfo as any).lastUpdated >= (new Date().getTime() - (30 * 60 * 1000)) && (carInfo as any).items.length > 0) {
        isLocalStorage = true;
      }
    }

    if (sessionStorage.getItem('changedColumns')) {
      sessionStorage.removeItem('changedColumns');
    }

    if (!isLocalStorage && this.authRoleService.isAuthorized) {
      this.apiService.apiGet('/carsinfo').subscribe(
        result => {
          const rowData = [];
          const newCarInfo = new Object();

          for (const row in result) {
            if (result.hasOwnProperty(row)) {
              const data = result[row];
              rowData.push(new CarClass(data.id, data.license_plate, data.driver_name, data.driver_skill, data.token));
            }
          }

          event.api.setRowData(rowData);
          event.api.sizeColumnsToFit();
          this.callProcessing = '';

          (newCarInfo as any).items = rowData;
          (newCarInfo as any).lastUpdated = new Date().getTime();
          localStorage.setItem('carInfo', JSON.stringify(newCarInfo));
        },
        error => {
          this.handleError(error);
        }
      );
    } else {
      console.log('Local');
      event.api.setRowData((carInfo as any).items);
      event.api.sizeColumnsToFit();
      this.callProcessing = '';
    }
  }

  private handleError(error) {
    this.buttonSaveInner = 'Er is een fout opgetreden';
    console.error(error);
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
