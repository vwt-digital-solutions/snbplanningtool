import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PlanningService } from 'src/app/services/planning.service';
import { GridOptions } from 'ag-grid-community';
import { DataGrid } from 'src/app/classes/datagrid';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements AfterViewInit {
  @ViewChild('planningGrid') agGrid: GridOptions;
  gridName = 'planning';
  title = 'Planning';

  gridOptions: GridOptions = DataGrid.GetDefaults(this.gridName);

  constructor(
    private planningService: PlanningService
  ) {
    this.gridOptions.columnDefs = this.planningService.colDefs;
  }

  ngAfterViewInit(): void {
    this.agGrid.api.showNoRowsOverlay();
  }

  resetFilters(): void {
    this.agGrid.api.setFilterModel(null);
    this.agGrid.api.setSortModel(null);
  }

  resetGrid(): void {
    DataGrid.ClearOptions(this.gridOptions, this.gridName);
  }

  createPlanning(): void {
    this.agGrid.api.showLoadingOverlay();
    this.planningService.getPlanning().subscribe(rowData => {
      this.agGrid.api.setRowData(rowData);
      this.agGrid.api.hideOverlay();
    });
  }
}
