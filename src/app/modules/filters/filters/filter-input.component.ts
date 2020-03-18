import {Component, Input, OnInit} from '@angular/core';
import {Filter} from './filters';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {

  @Input() filter: Filter;

  public collapsed = true;

  constructor() { }

  ngOnInit() {
  }

}
