import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { GridOptions } from 'ag-grid-community';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  gridOptions: GridOptions;

  constructor() {
    const that = this;
    this.gridOptions = {
      columnDefs: [
        { headerName: 'Projectnummer', field: 'project_number', pinned: 'left', width: 100 },
        { headerName: 'Status', field: 'status', pinned: 'left', width: 100 },
        { headerName: 'Taaktype', field: 'task_type' },
        { headerName: 'Beschrijving', field: 'description' },
        {
          headerName: 'Startdatum',
          field: 'start_timestamp',
          cellRenderer: this.dateRenderer,
          filter: 'agDateColumnFilter',
          filterParams: { comparator: this.dateComparator }
        },
        {
          headerName: 'Einddatum',
          field: 'end_timestamp',
          cellRenderer: this.dateRenderer,
          filter: 'agDateColumnFilter',
          filterParams: { comparator: this.dateComparator }
        },
        { headerName: 'Naam medewerker', field: 'employee_name' },
        {
          headerName: 'Adres',
          children: [
            { headerName: 'Plaats', field: 'city' },
            { headerName: 'Postcode', field: 'zip' },
            { headerName: 'Straat', field: 'street' }
          ]
        },
        {
          headerName: 'Locatie',
          field: 'L2GUID',
          cellRenderer: this.cellTokenLocator,
          sortable: false,
          filter: false,
          editable: false,
          width: 100,
          pinned: 'right'
        }
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: false
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

  dateComparator(filterDate, cellValue) {
    if (cellValue == null) return 0;

    const old_date = new Date(cellValue).setHours(0,0,0,0);
    const new_date = new Date(filterDate).setHours(0,0,0,0);

    if (old_date < new_date) {
      return -1;
    } else if (old_date > new_date) {
      return 1;
    } else {
      return 0;
    }
  }

  dateRenderer(params) {
    return (params.value ? formatDate(params.value, 'dd-MM-yyyy hh:mm', 'nl') : '');
  }

  cellTokenLocator(params) {
    console.log(params)
    if (params.data.geometry && params.value !== '') {
      return '<a href="/kaart/' + params.value + '">Bekijk</a>';
    } else {
      return '-';
    }
  }

  private handleError(error) {
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
