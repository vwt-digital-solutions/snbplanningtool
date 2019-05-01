import { Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { throwError } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CarsInfoService {
  public isHidden: boolean = true;
  public tokens: Object;
  gridOptions: GridOptions;

  constructor(
    private apiService: ApiService
  ) {
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'Token', field: 'token', sort: 'asc', cellEditorSelector: this.cellEditorSelector },
        { headerName: 'License plate', field: 'license_plate' },
        { headerName: 'Driver name', field: 'driver_name' }
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: true
      },
      rowData: [],
      enableRangeSelection: true,
      statusBar: {
        statusPanels: [{ statusPanel: "agTotalRowCountComponent", align: "left" }]
      }
    };

    this.apiService.getCarsTokens().subscribe(
      result => {
        localStorage.setItem('carTokens', JSON.stringify(result));
      },
      error => this.handleError(error)
    );
  }

  cellEditorSelector(params){
    var carTokens = JSON.parse(localStorage.getItem('carTokens'));
    carTokens.push(params.value);

    return {
      component: 'agRichSelectCellEditor',
      params: { values: carTokens }
    };
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
