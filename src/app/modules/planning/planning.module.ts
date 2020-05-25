import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningComponent } from './planning.component';
import { AgGridModule } from 'ag-grid-angular';

import {FiltersModule} from '../filters/filters.module';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FiltersModule
  ],
  declarations: [
    PlanningComponent
  ],
  exports : [
    CommonModule,
    PlanningComponent

  ],
  bootstrap: [PlanningComponent]
})
export class PlanningModule { }
