import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';

import { ApiService } from 'src/app/services/api.service';
import { CarsService } from 'src/app/services/cars.service';
import { Car } from 'src/app/classes/car';
import {CarProviderService} from '../../services/car-provider.service';

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
  grid = null;

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService,
    public carsService: CarsService,
    public carProviderService: CarProviderService
  ) { }

  onBtRefresh() {
    this.carProviderService.getCars();
  }
  onBtExport() {
    this.carsService.gridOptions.api.exportDataAsExcel();
  }

  onBtSave() {
    const that = this;
    this.buttonSaveInner = 'Opslaan <i class="fas fa-sync-alt fa-spin"></i>';

    this.carProviderService.savingSubject.subscribe(saving => {
      if(! saving) {
        this.carProviderService.savingSubject.unsubscribe();
        this.buttonSaveInner = 'Opgeslagen <i class="fas fa-check"></i>';
        setTimeout(() => {
          that.buttonSaveInner = 'Opslaan';
          that.editedColumns = [];
        }, 2000);
      }
    });

    this.carProviderService.postCarInfo(this.editedColumns);
  }

  onCellValueChanged(row) {
    if (row.oldValue !== row.newValue) {
      let isExisting = false;

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

  setLoading(loading) {
    if (loading) {
      this.callProcessing = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';
    } else {
      this.callProcessing = '';
    }
  }

  setCarInfo(items) {
    this.grid.api.setRowData(items);
    this.grid.api.sizeColumnsToFit();
  }

  onGridReady(grid: any) {
    this.grid = grid;

    this.carProviderService.carsInfoSubject.subscribe((items: any[]) => {
      this.setCarInfo(items);
    },
      this.handleError);

    this.carProviderService.loadingSubject.subscribe((loading: boolean) => {
      this.setLoading(loading);
    });

  }

  private handleError(error) {
    this.buttonSaveInner = 'Er is een fout opgetreden';
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
