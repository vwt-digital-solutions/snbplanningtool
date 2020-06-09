import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineersComponent } from './engineers.component';
import { AgGridModule } from 'ag-grid-angular';

import { EngineerFormComponent } from 'src/app/components/cars-form/engineer-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FormsModule
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
export class CarsModule { }
