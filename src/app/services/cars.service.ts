import { Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

import { AuthRoleService } from './auth-role.service';
import {CarProviderService} from './car-provider.service';
import { MapGeometryObject } from '../classes/map-geometry-object';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  public isHidden = true;
  public tokens: object;
  gridOptions: GridOptions;

  constructor(
    public authRoleService: AuthRoleService,
    public carProviderService: CarProviderService
  ) {
    this.gridOptions = {
      columnDefs: [
        { headerName: 'Token', field: 'token', sort: 'asc', cellEditorSelector: this.cellEditorToken },
        { headerName: 'Administratie (klantteam)', field: 'administration', cellEditorSelector: this.cellEditorAdministration },
        { headerName: 'Kentekenplaat', field: 'licensePlate', editable: false },
        { headerName: 'Naam', field: 'name', },
        { headerName: 'Medewerkernr.', field: 'employeeNumber'},
        { headerName: 'Rol', field: 'role', cellEditorSelector: this.cellEditorDriverRole },
        { headerName: 'Afdeling', field: 'business_unit', cellEditorSelector: this.cellEditorBusinessUnit },
        {
          headerName: 'Locatie',
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
      pagination: true,
      paginationPageSize: 30,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent', align: 'left' }
        ]
      }
    };
  }

  cellEditorToken(params): object {
    const carTokens = this.carProviderService.carsInfoSubject.value;

    return {
      component: 'agRichSelectCellEditor',
      params: { values: carTokens.concat([params.value]) }
    };
  }

  cellEditorAdministration(): object {
    return {
      component: 'agRichSelectCellEditor',
      params: { values: MapGeometryObject.administrations }
    };
  }

  cellEditorBusinessUnit(): object {
    return {
      component: 'agRichSelectCellEditor',
      params: { values: MapGeometryObject.businessUnits }
    };
  }

  cellEditorDriverRole(): object {
    const values = ['Metende', 'Lasser', 'Leerling', 'Kraanmachinist', 'Overig', 'NLS', 'Cluster'];

    return {
      component: 'agRichSelectCellEditor',
      params: { values }
    };
  }

  cellTokenLocator(params): string {
    if (params.value !== '' && !isNullOrUndefined(params.value)) {
      return '<a href="/kaart/' + params.value.replace(/\//g, '-') + '">Bekijk</a>';
    } else {
      return '-';
    }
  }

}
