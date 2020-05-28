import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';

import { AuthRoleService } from 'src/app/services/auth-role.service';

import { CarsService } from 'src/app/services/cars.service';
import {CarProviderService} from '../../services/car-provider.service';
import { Engineer } from 'src/app/classes/engineer';

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
  title = 'Monteur informatie';
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
    public carsService: CarsService,
    public carProviderService: CarProviderService
  ) { }

  onBtRefresh(): void {
    this.carProviderService.getCars();
  }
  onBtExport(): void {
    this.carsService.gridOptions.api.exportDataAsExcel();
  }

  onBtSave(): void {
    // TODO - Remove that = this
    const that = this; // eslint-disable-line @typescript-eslint/no-this-alias
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

  onCellValueChanged(row): void {
    if (row.oldValue !== row.newValue) {
      let isExisting = false;

      this.editedColumns.forEach((item) => {
        if (item.id === row.data.id) {
          item = row.data;
          isExisting = true;
        }
      });

      if (!isExisting) {
        this.editedColumns.push(row.data);
      }
    }
  }

  setLoading(loading): void {
    if (loading) {
      this.callProcessing = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';
    } else {
      this.callProcessing = '';
    }
  }

  setCarInfo(items): void {
    this.grid.api.setRowData(items);
    this.grid.api.sizeColumnsToFit();
  }

  onGridReady(grid): void {
    this.grid = grid;

    this.carProviderService.carsInfoSubject.subscribe((items: Engineer[]) => {
      this.setCarInfo(items);
    },
      this.handleError);

    this.carProviderService.loadingSubject.subscribe((loading: boolean) => {
      this.setLoading(loading);
    });

  }

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  private handleError(): any {
    this.buttonSaveInner = 'Er is een fout opgetreden';
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
