import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarsComponent } from './cars.component';
import { AgGridModule } from 'ag-grid-angular';

import { CarsFormComponent } from '../../components/cars-form/cars-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FormsModule
  ],
  declarations: [
    CarsComponent,
    CarsFormComponent
  ],
  exports : [
    CommonModule,
    CarsComponent,
    CarsFormComponent
  ],
  bootstrap: [CarsComponent]
})
export class CarsModule { }
