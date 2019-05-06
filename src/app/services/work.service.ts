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
    let that = this;
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'Project number', field: 'project_number', pinned: 'left', width: 100 },
        { headerName: 'Status', field: 'status', pinned: 'left', width: 100 },
        { headerName: 'Task type', field: 'task_type' },
        { headerName: 'Description', field: 'description' },
        {
          headerName: 'Start date',
          children: [
            { headerName: 'Date', field: 'start_timestamp', cellRenderer: this.dateFormatter, filter: 'agDateColumnFilter' },
            { headerName: 'Time', field: 'start_timestamp', cellRenderer: this.dateTimeFormatter, filter: 'agDateColumnFilter' }
          ]
        },
        {
          headerName: 'End date',
          children: [
            { headerName: 'Date', field: 'end_timestamp', cellRenderer: this.dateFormatter, filter: 'agDateColumnFilter' },
            { headerName: 'Time', field: 'end_timestamp', cellRenderer: this.dateTimeFormatter, filter: 'agDateColumnFilter' }
          ]
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
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: false
      },
      rowData: [],
      enableRangeSelection: true,
      statusBar: {
        statusPanels: [{ statusPanel: "agTotalRowCountComponent", align: "left" }]
      }
    };
  }

  dateFormatter(params){
    return formatDate(params.value, 'dd-MM-yyyy', 'nl');
  }

  dateTimeFormatter(params){
    return formatDate(params.value, 'HH:mm', 'nl');
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
