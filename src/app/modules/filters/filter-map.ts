import { Injectable } from '@angular/core';
import {Filter, ValueFilter} from './filters/filters';
import {Subject} from 'rxjs/index';

export class FilterMap {

  filters: Filter[];

  filterChanged = new Subject<any>();

  constructor(filters = []) {
    this.filters = filters;
    this.filters.forEach((filter, _) => {
      filter.dataChanged.subscribe(value => {
        this.filterChanged.next(value);
      });
    });

  }

  public filterList(listToFilter) {
    const originalList = listToFilter;
    this.filters.forEach((filter, _) => {
      listToFilter = filter.filterList(listToFilter, originalList);
    });

    return listToFilter;
  }
}
