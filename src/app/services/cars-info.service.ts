import { Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CarsInfoService {
  public isHidden: boolean = true;
  gridOptions: GridOptions;

  constructor(
    private apiService: ApiService
  ) {
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'Token', field: 'token', sort: 'asc', valueFormatter: this.tokenFormatter },
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
  }

  tokenFormatter(params) {
    var lastSlash = params.value.lastIndexOf("/");
    var label = params.value.substring(lastSlash + 1);
    return label;
  }
}
