import { Component } from '@angular/core';
import { throwError } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { WorkService } from 'src/app/services/work.service';

import { WorkClass } from 'src/app/classes/work-class';
import {WorkItemProviderService} from '../../services/work-item-provider.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  title = 'Werk tickets';
  buttonExport = 'Exporten naar Excel';
  callProcessing: string;

  workItems = [];
  gridReady = false;
  grid;

  constructor(
    public workService: WorkService,
    public workItemProviderService: WorkItemProviderService
  ) {

    this.callProcessing = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';

    this.workItems = workItemProviderService.filteredWorkItems;

    workItemProviderService.workItemsSubject.subscribe(
      value => {
        this.workItems = value;
        this.workItemsToGrid();
      }
    );

  }

  onBtExport() {
    this.workService.gridOptions.api.exportDataAsExcel();
  }

  onGridReady(event: any) {
    this.gridReady = true;
    this.grid = event;
    this.workItemsToGrid();
  }

  workItemsToGrid() {
    if (!this.gridReady) {
      return;
    }

    const rowData = [];

    for (const row in this.workItems) {
      if (this.workItems.hasOwnProperty(row)) {
        const data = this.workItems[row];
        rowData.push(new WorkClass(
          data.administration, data.category, data.resolve_before_timestamp,
          data.stagnation, data.project,
          data.city, data.description,
          data.employee_name, data.end_timestamp,
          data.geometry, data.project_number,
          data.start_timestamp, data.status,
          data.street, data.task_type,
          data.zip, data.l2_guid
        ));
      }
    }

    this.grid.api.setRowData(rowData);
    this.callProcessing = '';
  }

  private handleError(error) {
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
