import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterComponent} from './filter.component';
import {FilterInputComponent} from './filters/filter-input.component';

@NgModule({
  declarations: [
    FilterComponent,
    FilterInputComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FiltersModule { }
