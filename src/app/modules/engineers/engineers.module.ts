import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineersComponent } from './engineers.component';
import { AgGridModule } from 'ag-grid-angular';
import { DDMTLibModule } from '@vwt-digital/ddmt-lib';

import { EngineerFormComponent } from 'src/app/components/cars-form/engineer-form.component';
import { FormsModule } from '@angular/forms';

export { EngineersComponent } from './engineers.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FormsModule,
    DDMTLibModule
  ],
  declarations: [
    EngineersComponent,
    EngineerFormComponent
  ],
  exports : [
    CommonModule,
    EngineersComponent,
    EngineerFormComponent
  ],
  bootstrap: [EngineersComponent]
})
export class EngineersModule { }
