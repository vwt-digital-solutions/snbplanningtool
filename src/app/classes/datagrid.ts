import { GridOptions } from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

export class DataGrid {
  static GetDefaults(
    gridName: string,
    showToolPanel = true,
    saveGridState = true
  ): GridOptions {

    let gridOptions: GridOptions = null;

    const saveColumnState = (state: ColumnState[]): void => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      localStorage.setItem(`${gridName}-GRID-STATE`, JSON.stringify(state));
    };

    const getColumnState = (): void | ColumnState[] => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      return JSON.parse(localStorage.getItem(`${gridName}-GRID-STATE`));
    };

    type ColGroupState = {
      groupId: string;
      open: boolean;
    }[];

    const saveColumnGroupState = (state: ColGroupState): void => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      localStorage.setItem(`${gridName}-GRID-GROUP-STATE`, JSON.stringify(state));
    };

    const getColumnGroupState = (): void | ColGroupState => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      return JSON.parse(localStorage.getItem(`${gridName}-GRID-GROUP-STATE`));
    };

    gridOptions = {
      showToolPanel,
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: false,
        enableRowGroup: true,
        enablePivot: true,
      },
      rowData: [],
      enableRangeSelection: true,
      pagination: true,
      paginationPageSize: 30,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent', align: 'left' }
        ]
      },
      sideBar: {
        defaultToolPanel: null,
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true
            },
          }
        ]
      },
      onColumnMoved: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnPinned: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnVisible: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnResized: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnRowGroupChanged: (ev): void => {
        saveColumnState(ev.columnApi.getColumnState());
        saveColumnGroupState(ev.columnApi.getColumnGroupState());
      },
      onGridReady: (ev): void => {
        const colState = getColumnState();
        const colGroupState = getColumnGroupState();

        if (colState) {
          ev.columnApi.setColumnState(colState);
        }

        if (colGroupState) {
          ev.columnApi.setColumnGroupState(colGroupState);
        }
      }
    };

    gridOptions.rowData = [] as any | any[];

    return gridOptions;
  }

  static ClearOptions(grid: GridOptions, gridName): void {
    localStorage.removeItem(`${gridName}-GRID-STATE`);
    localStorage.removeItem(`${gridName}-GRID-GROUP-STATE`);
    grid.columnApi.resetColumnState();
    grid.columnApi.resetColumnGroupState();
  }
}
