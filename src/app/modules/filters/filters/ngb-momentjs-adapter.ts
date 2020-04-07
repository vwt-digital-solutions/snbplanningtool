import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

// Might need to polyfill depending on needed browser support...
const isInt = Number.isInteger;

@Injectable()
export class NgbMomentjsAdapter extends NgbDateAdapter<moment.Moment> {

  fromModel(date: moment.Moment): NgbDateStruct {
    if (!date || !moment.isMoment(date)) {
      return null;
    }

    return {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    };
  }

  toModel(date: NgbDateStruct): moment.Moment {
    if (!date || !isInt(date.day) || !isInt(date.day) || !isInt(date.day)) {
      return null;
    }

    return moment.utc(`${date.year}-${date.month}-${date.day}`, 'YYYY-M-D');
  }
}
