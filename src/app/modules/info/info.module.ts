import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoComponent } from './info.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    InfoComponent
  ],
  exports : [
    CommonModule,
    InfoComponent
  ],
  bootstrap: [InfoComponent]
})
export class InfoModule { }
