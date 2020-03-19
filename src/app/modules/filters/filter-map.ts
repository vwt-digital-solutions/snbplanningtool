import { Filter } from './filters/filters';
import {Subject} from 'rxjs/index';

export class FilterMap {

  filters: Filter[];

  filterChanged = new Subject<any>();

  constructor(filters = []) {
    this.filters = filters;
    this.filters.forEach(filter => {
      filter.dataChanged.subscribe(value => this.filterChanged.next(value));
    });

  }

  public setFilterValues(queryParams) {
    const keys = Object.keys(queryParams);
    this.filters.forEach((filter: any) => {
      keys.forEach(key => {
        if (filter.name === key && queryParams[key]) {
          filter.setValue(queryParams[key]);
        }
      });
    });
  }

  public filterList(listToFilter) {
    const originalList = listToFilter;
    this.filters.forEach((filter) => {
      listToFilter = filter.filterList(listToFilter, originalList);
    });

    return listToFilter;
  }
}
