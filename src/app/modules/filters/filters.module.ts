import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterComponent} from './filter.component';
import {FilterInputComponent} from './filters/filter-input.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    FilterComponent,
    FilterInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FiltersModule { }
