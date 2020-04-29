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
    this.gridOptions = {
      columnDefs: [
        { headerName: 'Administratie (klantteam)', field: 'administration', pinned: 'left', width: 200 },
        { headerName: 'Status', field: 'status', pinned: 'left', width: 100 },
        { headerName: 'Categorie', field: 'category', width: 100 },
        { headerName: 'Projectnummer', field: 'project_number', width: 100 },
        { headerName: 'Project', field: 'project', width: 100 },
        {
          headerName: 'Uiterstehersteltijd',
          field: 'resolve_before_timestamp',
          cellRenderer: this.dateRenderer,
          filter: 'agDateColumnFilter',
          filterParams: { comparator: this.dateComparator }
        },
        { headerName: 'Taaktype', field: 'task_type' },
        { headerName: 'Beschrijving', field: 'description' },
        { headerName: 'Stagnatie', field: 'stagnation',
          editable: false,
          cellRenderer: this.boolRenderer,
        },
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
        { headerName: 'Medewerkernr.', field: 'employee_number' },
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
          field: 'l2_guid',
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
    if (cellValue == null) { return 0; }

    const oldDate = new Date(cellValue).setHours(0, 0, 0, 0);
    const newDate = new Date(filterDate).setHours(0, 0, 0, 0);

    if (oldDate < newDate) {
      return -1;
    } else if (oldDate > newDate) {
      return 1;
    } else {
      return 0;
    }
  }

  dateRenderer(params) {
    return (params.value ? formatDate(params.value, 'dd-MM-yyyy hh:mm', 'nl') : '');
  }

  boolRenderer(params) {
    return `<input type='checkbox' disabled="true" ${params.value ? 'checked' : ''} />`;
  }

  cellTokenLocator(params) {
    if (params.data.geometry && params.data.geometry.coordinates.length && params.value !== '') {
      return '<a class="work-item-view-link" href="/kaart/' + params.value + '">Bekijk</a>';
    } else {
      return '-';
    }
  }

  private handleError(error) {
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
