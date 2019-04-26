import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';

import { GridOptions } from "ag-grid-community";

import { ApiService } from 'src/app/services/api.service';

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
  gridOptions: GridOptions;
  title: string = 'Car info';
  titleExport: string = 'Export to Excel';
  titleSave: string = 'Save';

  constructor(
    private apiService: ApiService
  ) {
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'ID', field: 'properties.id', sort: 'asc' },
        { headerName: 'License plate', field: 'properties.license_plate' },
        { headerName: 'Driver name', field: 'properties.driver_name' }
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: true
      },
      rowData: [],
      enableRangeSelection: true
    };
  }

  onBtExport(){
    this.gridOptions.api.exportDataAsExcel();
  }
  onBtSave(){
    console.log('Save');
  }

  onGridReady(event: any) {
    this.apiService.getCarsInfo().subscribe(
      result => {
        event.api.setRowData(result['features']);
        event.api.sizeColumnsToFit();
      },
      error => this.handleError(error)
    );
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
