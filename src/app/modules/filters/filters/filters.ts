import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export abstract class Filter {

  // The name to display for this filter.
  name: string;

  // The value on which to filter the given array of objects.
  field: string;

  // The current filter's value.
  value;

  // An optional default value.
  defaultValue;

  inputType = 'input';

  dataChanged = new Subject<any>();

  constructor(name: string, field: string, defaultValue = null) {
    this.name = name;
    this.field = field;
    this.defaultValue = defaultValue;
    this.value = defaultValue;
  };

  abstract filterElement(element, index, array): boolean;

  filterList(listToFilter: any[], originalList: any[]): any[] {

    if (this.value === null || this.value === undefined) {
      return listToFilter;
    }

    const result = listToFilter.filter(this.filterElement.bind(this));

    return result;
  }
}

/**
 * Default filter, user can input value their own value to filter.
 *
 */
enum ValueFilterType {
  contains,
  matches
}
export class ValueFilter extends Filter {

  type: ValueFilterType;

  constructor(name: string, field: string, defaultValue = null, type = ValueFilterType.contains) {
    super(name, field, defaultValue);
    this.type = type;
  }

  filterElement(element, index, array): boolean {
    switch (this.type) {
      case ValueFilterType.contains:
        return (element[this.field].toLowerCase().indexOf(this.value.toLowerCase()) !== -1)
      case ValueFilterType.matches:
        return (element[this.field].toLowerCase() === this.value.toLowerCase())
      default:
        return true;
    }

    return element[this.field] === this.value;
  }
}

/**
 * A filter that allows the user to choose from a list. Can be exclusive (only one choice),
 * or inclusive (multiple choice)
 */
export enum ChoiceFilterType {
    single = 'single-choice',
    multiple = 'multiple-choice',
    singleRadio = 'single-choice-radio'
}

export class ChoiceFilter extends Filter  {

  type = ChoiceFilterType.single
  options: any[];
  inferOptionsFromList = false;

  constructor(name: string, field: string, type = ChoiceFilterType.single, options: any[] = null, defaultValue = null,) {
    super(name, field, defaultValue);
    if (options == null) {
      this.inferOptionsFromList = true;
    } else {
      this.options = options;
    }

    this.type = type;

    if(type === ChoiceFilterType.multiple) {
      this.value = [];
    }

    this.inputType = type.toString();
  }

  toggleValue(newValue) {
    const index = this.value.indexOf(newValue);

    if (index > -1) {
      this.value.splice(index, 1);
    } else {
      this.value.push(newValue);
    }

    this.dataChanged.next(true);
  }


  filterList(listToFilter: any[], originalList: any[]): any[] {
    if (this.inferOptionsFromList) {
      this.options = originalList.map(value => value[this.field]).filter((v, i, a) => a.indexOf(v) === i)
    }

    return super.filterList(listToFilter, originalList);
  }

  filterElement(element, index, array): boolean {

    if (this.value === '' || this.value === undefined || this.value.length === 0) {
      return true;
    }

    switch (this.type) {
      case ChoiceFilterType.single:
        return element[this.field] === this.value;
      case ChoiceFilterType.singleRadio:
        return element[this.field] === this.value;
      case ChoiceFilterType.multiple:
        return this.value.indexOf(element[this.field]) > -1;
      default:
        return true;
    }
  }
}

/**
 * A filter that allows the user to choose a cutoff value.
 * Filtered values can be greater than or less than the given value.
 */
enum OffsetFilterType {
  greaterThan,
  lessThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  equalTo
}

export class OffsetFilter extends Filter  {

  type: OffsetFilterType = OffsetFilterType.greaterThan

  filterElement(element, index, array): boolean {
    switch(this.type) {
      case OffsetFilterType.greaterThan:
        return element[this.field] > this.value;
      case OffsetFilterType.lessThan:
        return element[this.field] < this.value;
      case OffsetFilterType.greaterThanOrEqualTo:
        return element[this.field] >= this.value;
      case OffsetFilterType.lessThanOrEqualTo:
        return element[this.field] <= this.value;
      case OffsetFilterType.equalTo:
        return element[this.field] === this.value;
      default:
        return false;
    }
  }
}

/**
 * A filter that allows the user to choose a cutoff value.
 * Filtered values can be greater than or less than the given value.
 */
export class RangeFilter extends Filter  {
  filterElement(element, index, array): boolean {
    return element[this.value] >= this.value[0] && element[this.value] <= this.value[1];
  }
}


/**
 * A filter that allows the user to choose a cutoff value.
 * Filtered values can be greater than or less than the given value.
 */
export class DateFilter extends Filter  {

  inputType = 'date-range';

  value = [null, null];

  filterElement(element, index, array): boolean {
    const startDate = Date.parse(this.value[0]);
    const endDate = Date.parse(this.value[1]) + 24 * 60 * 60 * 1000;

    const elementDate = Date.parse(element[this.field]);

    if (isNaN(startDate) && isNaN(endDate)) {
      return true;
    }

    if (isNaN(elementDate)) {
      return false;
    }

    let elementMatches = isNaN(startDate) || startDate <= elementDate;

    elementMatches = elementMatches && (isNaN(endDate) || endDate >= elementDate);

    return elementMatches;

  }
}