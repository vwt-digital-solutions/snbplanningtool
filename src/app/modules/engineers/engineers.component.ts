import { Component } from '@angular/core';
import { throwError } from 'rxjs';

import { CarsService } from 'src/app/services/cars.service';
import {CarProviderService} from '../../services/car-provider.service';
import { Engineer } from 'src/app/classes/engineer';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-cars',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss']
})
export class EngineersComponent {
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
    public carsService: CarsService,
    public carProviderService: CarProviderService,
    public env: EnvService
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
