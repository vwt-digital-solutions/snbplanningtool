import {Subject, Observable} from 'rxjs/index';
import {isNullOrUndefined} from 'util';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { getValue } from './json-helper';
import * as moment from 'moment';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

type featureIdTypes = 'car' | 'work';
export abstract class Filter {

  // The name to display for this filter.
  name: string;

  // The value on which to filter the given array of objects.
  field: string;

  featureIdentifier: featureIdTypes;

  // The current filter's value.
  value;

  // An optional default value.
  defaultValue;

  inputType = 'input';

  dataChanged = new Subject<{ [name: string]: any}>();

  constructor(
    featureIdentifier: featureIdTypes,
    name: string,
    field: string,
    defaultValue = null,
  ) {
    this.name = name;
    this.field = field;
    this.defaultValue = defaultValue;
    this.value = defaultValue;
    this.featureIdentifier = featureIdentifier;
  }

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

  constructor(
    featureIdentifier: featureIdTypes,
    name: string,
    field: string,
    defaultValue = null,
    type = ValueFilterType.contains
  ) {
    super(featureIdentifier, name, field, defaultValue);
    this.type = type;
  }

  setValue(newValue) {
    this.value = newValue;
  }

  dataChange(value) {
    this.value = value;
    this.dataChanged.next({
      [`${this.featureIdentifier}|${this.name}`]: value !== '' ? value : null
    });
  }

  filterElement(element, index, array): boolean {
    switch (this.type) {
      case ValueFilterType.contains:
        return (getValue(element, this.field).toLowerCase().indexOf(this.value.toLowerCase()) !== -1);
      case ValueFilterType.matches:
        return (getValue(element, this.field).toLowerCase() === this.value.toLowerCase());
      default:
        return true;
    }
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
  type = ChoiceFilterType.single;
  options: any[];
  icons: { option: string, icon: string };
  inferOptionsFromList = false;

  constructor(
    featureIdentifier: featureIdTypes,
    name: string,
    field: string,
    type = ChoiceFilterType.single,
    options: any[] = null,
    defaultValue = null,
    icons = null
  ) {
    super(featureIdentifier, name, field, defaultValue);
    if (options == null) {
      this.inferOptionsFromList = true;
    } else {
      this.options = options;
    }

    this.icons = icons;
    this.type = type;

    if (type === ChoiceFilterType.multiple) {
      this.value = [];
    }

    this.inputType = type.toString();
  }

  setValue(newValue) {
    if (this.type === ChoiceFilterType.multiple) {
      this.value = Array.isArray(newValue) ? newValue : [newValue];
    }

    if ([ChoiceFilterType.single, ChoiceFilterType.singleRadio].includes(this.type)) {
      this.value = newValue;
    }
  }

  toggleValue(newValue) {
    const index = this.value.indexOf(newValue);

    if (index > -1) {
      this.value.splice(index, 1);
    } else {
      this.value.push(newValue);
    }

    this.dataChanged.next({
      [`${this.featureIdentifier}|${this.name}`]: this.value
    });
  }


  filterList(listToFilter: any[], originalList: any[]): any[] {
    if (this.inferOptionsFromList) {
      this.options = originalList
        .map(value => {
          return ![undefined, null, ''].includes(value) ?
            getValue(value, this.field) :
            '';
        })
        .filter((v, i, a) => {
          return a.indexOf(v) === i && ![undefined, null, ''].includes(v);
        })
        .sort();
    }

    return super.filterList(listToFilter, originalList);
  }

  filterElement(element, index, array): boolean {

    if (this.value === '' || this.value === undefined || this.value.length === 0) {
      return true;
    }

    switch (this.type) {
      case ChoiceFilterType.single:
        return getValue(element, this.field) === this.value;
      case ChoiceFilterType.singleRadio:
        return getValue(element, this.field) === this.value;
      case ChoiceFilterType.multiple:
        return this.value.indexOf(getValue(element, this.field)) > -1;
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

  type: OffsetFilterType = OffsetFilterType.greaterThan;

  filterElement(element, index, array): boolean {
    switch (this.type) {
      case OffsetFilterType.greaterThan:
        return getValue(element, this.field) > this.value;
      case OffsetFilterType.lessThan:
        return getValue(element, this.field) < this.value;
      case OffsetFilterType.greaterThanOrEqualTo:
        return getValue(element, this.field) >= this.value;
      case OffsetFilterType.lessThanOrEqualTo:
        return getValue(element, this.field) <= this.value;
      case OffsetFilterType.equalTo:
        return getValue(element, this.field) === this.value;
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

  inputType = 'range';

  filterElement(element, index, array): boolean {
    return getValue(element, this.field) >= this.value[0] && element[this.value] <= this.value[1];
  }
}


/**
 * A filter that allows the user to choose a cutoff value.
 * Filtered values can be greater than or less than the given value.
 */
export class DateFilter extends Filter  {

  inputType = 'date-range';

  value = {
    fromDate: null,
    toDate: null,
  };

  typesOfInput = [
    'datum selectie',
    'morgen',
    'volgende week',
    'volgende maand'
  ];

  selectedInputTypes = {
    fromDate: this.typesOfInput[0],
    toDate: this.typesOfInput[0]
  };

  setValue(newValue) {
    const data = JSON.parse(newValue);
    this.value.fromDate = data.fromDate ? moment(data.fromDate, 'YYYY-MM-DD') : null;
    this.value.toDate = data.toDate ? moment(data.toDate, 'YYYY-MM-DD') : null;
  }

  search = (text: Observable<string>) => {
    const debouncedText = text.pipe(debounceTime(200), distinctUntilChanged());
    return debouncedText.pipe(
      map((term: string) => (term === '' ? this.typesOfInput :
        this.typesOfInput.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  setInputType(value, field) {
    if (value && this.typesOfInput.includes(value)) {
      this.selectedInputTypes[field] = value;

      if (value !== 'datum selectie') {
        const today = moment();
        const dateMap = {
          morgen: moment(today).add(1, 'days'),
          'volgende week': moment(today).add(1, 'weeks'),
          'volgende maand': moment(today).add(1, 'months'),
        };

        const date = dateMap[value];

        this.dateChanged(field, date);
      }
    }
  }

   /**
    * Dates are converted to ISO due to the following issue.
    * @see https://github.com/moment/moment/issues/4751
    */
  momentToIso(value: moment.Moment): string {
    if (!isNullOrUndefined(value)) {
      return value.toISOString();
    }
  }

  dateChanged(dateField, value: any) {
    this.value[dateField] = value;
    let data;

    if (Object.values(this.value).some(val => val !== null)) {
      data = {
        fromDate: this.momentToIso(this.value.fromDate),
        toDate: this.momentToIso(this.value.toDate),
      };
    }

    this.dataChanged.next({
      [`${this.featureIdentifier}|${this.name}`]: JSON.stringify(data)
    });
  }

  filterList(listToFilter: any[], originalList: any[]): any[] {
    if (!this.value.fromDate && !this.value.toDate) {
      return listToFilter;
    }

    return super.filterList(listToFilter, originalList);
  }

  filterElement(element): boolean {
    // Return value if both from and to date are undefind or null
    if (isNullOrUndefined(this.value.fromDate) && isNullOrUndefined(this.value.toDate)) {
      return true;
    }

    // Don't return value if element has no date
    const elementMoment = moment(getValue(element, this.field));
    if (isNullOrUndefined(elementMoment)) {
      return false;
    }

    // Check if our data exists and if it does if it falls outside of our dataset.
    const matchesStartCriteria = isNullOrUndefined(this.value.fromDate) || this.value.fromDate.isBefore(elementMoment);
    const matchesEndCriteria = isNullOrUndefined(this.value.toDate) || this.value.toDate.add(1, 'days').isAfter(elementMoment);

    return matchesStartCriteria && matchesEndCriteria;
  }
}

export class BooleanFilter extends Filter {
  inputType = 'optional-boolean';

  setValue(newValue) {
    if (newValue != null) {
      this.value = newValue;
    }
  }

  dataChange(value) {
    this.value = value;

    this.dataChanged.next({
      [`${this.featureIdentifier}|${this.name}`]: value !== '' ? value : null
    });
  }

  filterElement(element): boolean {
    if (this.value === '') {
      return true;
    }

    return getValue(element, this.field) === this.value;
  }
}
