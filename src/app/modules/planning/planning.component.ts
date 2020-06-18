import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PlanningService } from 'src/app/services/planning.service';
import { GridOptions } from 'ag-grid-community';
import { DataGrid } from 'src/app/classes/datagrid';
import { WorkService } from 'src/app/services/work.service';
import { CarsService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements AfterViewInit {
  @ViewChild('planning') planningGrid: GridOptions;
  @ViewChild('unplannedWork') unplannedWorkGrid: GridOptions;
  @ViewChild('unplannedEngineers') unplannedEngineerGrid: GridOptions;

  planningGridName = 'planning';
  unplannedWorkGridName = 'unplannedWork';
  unplannedEngineerGridName = 'unplannedEngineers';

  title = 'Planning';

  planningGridOptions: GridOptions = DataGrid.GetDefaults(this.planningGridName);
  unplannedWorkGridOptions: GridOptions = DataGrid.GetDefaults(this.unplannedWorkGridName);
  unplannedEngineerGridOptions: GridOptions = DataGrid.GetDefaults(this.unplannedEngineerGridName);

  constructor(
    private planningService: PlanningService,
    private workService: WorkService,
    private carService: CarsService
  ) {
    this.planningGridOptions.columnDefs = this.planningService.colDefs;
    this.unplannedEngineerGridOptions.columnDefs = [
      {
        headerName: 'Administratie (klantteam)',
        field: 'administration',
        sort: 'asc',
      },
      { headerName: 'Kentekenplaat', field: 'licensePlate', editable: false },
      { headerName: 'Naam', field: 'name', },
      { headerName: 'Medewerkernr.', field: 'employeeNumber', hide: true},
      { headerName: 'Rol', field: 'role' },
      { headerName: 'Afdeling', field: 'business_unit' },
      {
        headerName: 'Locatie',
        field: 'token',
        cellRenderer: this.carService.cellTokenLocator,
        sortable: false,
        filter: false,
        editable: false,
        width: 75,
        pinned: 'right'
      }
    ];
    this.unplannedWorkGridOptions.columnDefs = [
      { headerName: 'Administratie (klantteam)', field: 'administration', sort: 'asc', pinned: 'left' },
      { headerName: 'Categorie', pinned: 'left', field: 'category' },
      { headerName: 'Projectnummer', field: 'project_number', hide: true },
      { headerName: 'Project', field: 'project', hide: true },
      {
        headerName: 'Uiterstehersteltijd',
        field: 'resolve_before_timestamp',
        cellRenderer: this.workService.dateRenderer,
        filter: 'agDateColumnFilter',
        pinned: 'left',
        filterParams: { comparator: this.workService.dateComparator }
      },
      { headerName: 'Taaktype', field: 'task_type' },
      { headerName: 'Beschrijving', field: 'description' },
      { headerName: 'Stagnatie', field: 'stagnation',
        editable: false,
        cellRenderer: this.workService.boolRenderer,
      },
      {
        headerName: 'Locatie',
        field: 'l2_guid',
        cellRenderer: this.workService.cellTokenLocator,
        sortable: false,
        filter: false,
        editable: false,
        width: 100,
        pinned: 'right'
      }
    ];
  }

  ngAfterViewInit(): void {
    this.planningGrid.api.showNoRowsOverlay();
    this.unplannedWorkGrid.api.showNoRowsOverlay();
    this.unplannedEngineerGrid.api.showNoRowsOverlay();
  }

  resetFilters(): void {
    this.planningGrid.api.setFilterModel(null);
    this.planningGrid.api.setSortModel(null);

    this.unplannedWorkGrid.api.setFilterModel(null);
    this.unplannedWorkGrid.api.setSortModel(null);

    this.unplannedEngineerGrid.api.setFilterModel(null);
    this.unplannedEngineerGrid.api.setSortModel(null);
  }

  resetGrid(): void {
    DataGrid.ClearOptions(this.planningGridOptions, this.planningGridName);
    DataGrid.ClearOptions(this.unplannedWorkGridOptions, this.unplannedWorkGridName);
    DataGrid.ClearOptions(this.unplannedEngineerGridOptions, this.unplannedEngineerGridName);
  }

  createPlanning(): void {
    this.planningGrid.api.showLoadingOverlay();
    this.unplannedWorkGrid.api.showLoadingOverlay();
    this.unplannedEngineerGrid.api.showLoadingOverlay();

    this.planningService.getPlanning().subscribe(rowData => {
      this.planningGrid.api.setRowData(rowData.planning);
      this.planningGrid.api.hideOverlay();

      this.unplannedEngineerGrid.api.setRowData(rowData.unplannedEngineers);
      this.unplannedEngineerGrid.api.hideOverlay();

      this.unplannedWorkGrid.api.setRowData(rowData.unplannedWorkitems);
      this.unplannedWorkGrid.api.hideOverlay();
    });
  }
}
