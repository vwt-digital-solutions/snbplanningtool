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
    var isLocalStorage: boolean = false;

    if(localStorage.getItem('workItems')){
      var workItems = JSON.parse(localStorage.getItem('workItems'));

      if(workItems.lastUpdated >= (60 * 60 * 1000) && workItems.items.length > 0){
        isLocalStorage = true;
      }
    }

    if(!isLocalStorage){
      this.callProcessing = 'Processing <i class="fas fa-sync-alt fa-spin"></i>';
      this.apiService.apiGet('/workitems/all').subscribe(
        result => {
          var rowData = [],
            newworkItems = new Object();

          for (let row in result) {
            var data = result[row];
            rowData.push(new WorkClass(
              data.city, data.description,
              data.employee_name, data.end_timestamp,
              data.geometry, data.project_number,
              data.start_timestamp, data.status,
              data.street, data.task_type,
              data.zip
            ));
          }

          event.api.setRowData(rowData);
          this.callProcessing = '';

          newworkItems['items'] = rowData;
          newworkItems['lastUpdated'] = new Date().getTime();
          localStorage.setItem('workItems', JSON.stringify(newworkItems));
        },
        error => {
          this.handleError(error);
        }
      );
    } else{
      console.log('Local');
      event.api.setRowData(workItems.items);
    }

  }

  private handleError(error) {
    return throwError('Something bad happened, please try again later.');
  };
}