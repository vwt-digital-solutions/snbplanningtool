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
        { headerName: 'Project number', field: 'project_number', pinned: 'left', width: 100 },
        { headerName: 'Status', field: 'status', pinned: 'left', width: 100 },
        { headerName: 'Task type', field: 'task_type' },
        { headerName: 'Description', field: 'description' },
        {
          headerName: 'Start date',
          field: 'start_timestamp',
          cellRenderer: this.dateRenderer,
          filter: 'agDateColumnFilter',
          filterParams: { comparator: this.dateComparator }
        },
        {
          headerName: 'End date',
          field: 'end_timestamp',
          cellRenderer: this.dateRenderer,
          filter: 'agDateColumnFilter',
          filterParams: { comparator: this.dateComparator }
        },
        { headerName: 'Employee name', field: 'employee_name' },
        {
          headerName: 'Address',
          children: [
            { headerName: 'City', field: 'city' },
            { headerName: 'Zip code', field: 'zip' },
            { headerName: 'Street', field: 'street' }
          ]
        },
        {
          headerName: 'Location',
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
      statusBar: {
        statusPanels: [{ statusPanel: 'agTotalRowCountComponent', align: 'left' }]
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
    if (params.data.geometry && params.value !== '') {
      return '<a href="/map/' + params.value + '">View</a>';
    } else {
      return '-';
    }
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  }
}
