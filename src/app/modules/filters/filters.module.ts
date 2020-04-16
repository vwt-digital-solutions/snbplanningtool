import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterComponent} from './filter.component';
import {FilterInputComponent} from './filters/filter-input.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { BusinessUnitComponent } from './business-unit/business-unit.component';

@NgModule({
  declarations: [
    FilterComponent,
    FilterInputComponent,
    BusinessUnitComponent
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
