import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { GridOptions } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  gridOptions: GridOptions;

  constructor() {
    this.gridOptions = <GridOptions>{
      columnDefs: [
        { headerName: 'Project number', field: 'project_number', pinned: 'left', width: 100 },
        { headerName: 'Status', field: 'status', pinned: 'left', width: 100 },
        { headerName: 'Task type', field: 'task_type' },
        { headerName: 'Description', field: 'description' },
        { headerName: 'Start date', field: 'start_timestamp', valueFormatter: this.dateFormatter, filter: 'agDateColumnFilter' },
        { headerName: 'End date', field: 'end_timestamp', valueFormatter: this.dateFormatter, filter: 'agDateColumnFilter' },
        { headerName: 'Employee name', field: 'employee_name' },
        { headerName: 'City', field: 'city' },
        { headerName: 'Zip code', field: 'zip' },
        { headerName: 'Street', field: 'street' }
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
    var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    var newDate = new Date(params.value);

    return newDate.toLocaleDateString("nl-NL", options);
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
