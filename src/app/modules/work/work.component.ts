import { Component } from '@angular/core';
import { throwError } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { WorkService } from 'src/app/services/work.service';

import { WorkClass } from 'src/app/classes/work-class';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  title: string = 'Work items';
  buttonExport: string = 'Export to Excel';
  callProcessing: string;

  constructor(
    private apiService: ApiService,
    public workService: WorkService
  ) { }

  onBtExport(){
    this.workService.gridOptions.api.exportDataAsExcel();
  }

  onGridReady(event: any) {
    this.callProcessing = 'Processing <i class="fas fa-sync-alt fa-spin"></i>';
    this.apiService.apiGet('/workitems/all').subscribe(
      result => {
        let rowData = [];

        for (let row in result) {
          if (result.hasOwnProperty(row)) {
            const data = result[row];
            rowData.push(new WorkClass(
              data.city, data.description,
              data.employee_name, data.end_timestamp,
              data.geometry, data.project_number,
              data.start_timestamp, data.status,
              data.street, data.task_type,
              data.zip, data.L2GUID
            ));
          }
        }

        event.api.setRowData(rowData);
        this.callProcessing = '';
      },
      error => {
        this.handleError(error);
      }
    );
  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}
