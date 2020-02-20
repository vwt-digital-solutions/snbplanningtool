import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkComponent } from './work.component';
import { AgGridModule } from 'ag-grid-angular';

import {FiltersModule} from '../filters/filters.module';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FiltersModule
  ],
  declarations: [
    WorkComponent
  ],
  exports : [
    CommonModule,
    WorkComponent

  ],
  bootstrap: [WorkComponent]
})
export class WorkModule { }
