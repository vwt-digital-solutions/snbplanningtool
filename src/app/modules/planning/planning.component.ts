import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PlanningService } from 'src/app/services/planning.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements AfterViewInit {
  @ViewChild('planningGrid') agGrid: GridOptions;
  gridOptions = this.planningService.gridOptions;
  title = 'Planning';

  constructor(
    private planningService: PlanningService
  ) { }

  ngAfterViewInit(): void {
    this.agGrid.api.showNoRowsOverlay();
  }

  resetFilters(): void {
    this.agGrid.api.setFilterModel(null);
    this.agGrid.api.setSortModel(null);
  }

  createPlanning(): void {
    this.agGrid.api.showLoadingOverlay();
    this.planningService.getPlanning().subscribe(rowData => {
      this.agGrid.api.setRowData(rowData);
      this.agGrid.api.hideOverlay();
    });
  }
}
