import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkComponent } from './work.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    WorkComponent
  ],
  exports : [
    CommonModule,
    WorkComponent,
  ],
  bootstrap: [WorkComponent]
})
export class WorkModule { }
