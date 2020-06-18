import { Component } from '@angular/core';
import { WorkService } from 'src/app/services/work.service';

import { WorkItem } from 'src/app/classes/work-item';
import {WorkItemProviderService} from '../../services/work-item-provider.service';
import { GridReadyEvent, GridOptions } from 'ag-grid-community';
import { DataGrid } from 'src/app/classes/datagrid';

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
  gridName = 'work';
  gridOptions: GridOptions = DataGrid.GetDefaults(this.gridName);
  gridReady = false;
  grid;

  constructor(
    public workService: WorkService,
    public workItemProviderService: WorkItemProviderService
  ) {
    this.gridOptions.columnDefs = this.workService.columnDefs;

    this.callProcessing = 'Verwerken <i class="fas fa-sync-alt fa-spin"></i>';

    this.workItems = workItemProviderService.filteredWorkItems;

    workItemProviderService.workItemsSubject.subscribe(
      value => {
        this.workItems = value;
        this.workItemsToGrid();
      }
    );

  }

  onBtExport(): void {
    this.gridOptions.api.exportDataAsExcel();
  }

  resetGrid(): void {
    DataGrid.ClearOptions(this.gridOptions, this.gridName);
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridReady = true;
    this.grid = event;
    this.workItemsToGrid();
  }

  workItemsToGrid(): void {
    if (!this.gridReady) {
      return;
    }

    const rowData = [];

    for (const row in this.workItems) {
      if (this.workItems.hasOwnProperty(row)) { // eslint-disable-line no-prototype-builtins
        const data = this.workItems[row];
        rowData.push(new WorkItem(
          data.administration, data.category, data.resolve_before_timestamp,
          data.stagnation, data.project,
          data.city, data.description,
          data.employee_name, data.employee_number,
          data.end_timestamp,
          data.geometry, data.project_number,
          data.start_timestamp, data.status,
          data.street, data.task_type,
          data.zip, data.l2_guid,
          data.counter_id
        ));
      }
    }

    this.grid.api.setRowData(rowData);
    this.callProcessing = '';
  }
}
