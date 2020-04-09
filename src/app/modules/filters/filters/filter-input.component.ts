import {Component, Input} from '@angular/core';
import {Filter} from './filters';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbMomentjsAdapter } from './ngb-momentjs-adapter';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbMomentjsAdapter }
  ]
})
export class FilterInputComponent {

  @Input() filter: Filter;

  public collapsed = true;

}
