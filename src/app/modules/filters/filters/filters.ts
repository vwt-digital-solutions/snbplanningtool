import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

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

  dataChanged = new Subject<any>();

  constructor(name: string, field: string, defaultValue = null) {
    this.name = name;
    this.field = field;
    this.defaultValue = defaultValue;
    this.value = defaultValue;
  };

  abstract filterElement(element, index, array): boolean;

  filterList(listToFilter:any[]): any[] {

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
enum ChoiceFilterType {
    single,
    multiple
}

export class ChoiceFilter extends Filter  {

  type: ChoiceFilterType = ChoiceFilterType.single;
  choices: any[];

  constructor(name: string, field: string, choices: any[], defaultValue = null, type = ChoiceFilterType.single) {
    super(name, field, defaultValue);
    this.choices = choices;
    this.type = type;
  }

  filterElement(element, index, array): boolean {
    switch (this.type) {
      case ChoiceFilterType.single:
        return element[this.field] === this.value;
      case ChoiceFilterType.multiple:
        return this.value.indexOf(element[this.field]) > 0;
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
