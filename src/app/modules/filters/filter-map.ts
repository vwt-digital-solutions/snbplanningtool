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
      keys.forEach(keyAndIdentifier => {
        const [identifier, key] = keyAndIdentifier.split('|');
        if (filter.featureIdentifier !== identifier) {
          return;
        }

        if (filter.name !== key) {
          return;
        }

        if (queryParams[keyAndIdentifier]) {
          filter.setValue(queryParams[keyAndIdentifier]);
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
