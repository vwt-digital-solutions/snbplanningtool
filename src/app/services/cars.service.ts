import { Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { throwError } from 'rxjs';

import { ApiService } from './api.service';
import { AuthRoleService } from './auth-role.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  public isHidden: boolean = true;
  public tokens: Object;
  gridOptions: GridOptions;

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService
  ) {
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'Token', field: 'token', sort: 'asc', cellEditorSelector: this.cellEditorToken },
        { headerName: 'License plate', field: 'license_plate', valueSetter: this.cellEditorLicense },
        { headerName: 'Driver name', field: 'driver_name' },
        {
          headerName: 'Location',
          field: 'token',
          cellRenderer: this.cellTokenLocator,
          sortable: false,
          filter: false,
          editable: false,
          width: 75,
          pinned: 'right'
        }
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: (this.authRoleService.isEditor ? true : false)
      },
      rowData: [],
      enableRangeSelection: true,
      statusBar: {
        statusPanels: [{ statusPanel: "agTotalRowCountComponent", align: "left" }]
      }
    };
  }

  cellEditorLicense(params){
    if (params.newValue.match(/.{1,3}-.{2,3}-.{1,2}/g)) {
      params.data[params.colDef.field] = params.newValue;
      params.colDef.cellStyle = { color: 'black', backgroundColor: 'transparent' };
      return true;
    } else{
      params.colDef.cellStyle = { color: 'white', backgroundColor: '#c0392b' };
    }

    return false;
  }

  cellEditorToken(params){
    let carTokens = JSON.parse(localStorage.getItem('carTokens'));
    carTokens.items.push(params.value);

    return {
      component: 'agRichSelectCellEditor',
      params: { values: carTokens.items }
    };
  }

  cellTokenLocator(params){
    if(params.value != ''){
      return '<a href="/map/'+ params.value.replace(/\//g, '-') +'">View</a>';
    } else{
      return '';
    }
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
