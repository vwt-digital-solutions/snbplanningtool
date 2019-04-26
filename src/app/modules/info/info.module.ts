import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoComponent } from './info.component';
import { AgGridModule } from 'ag-grid-angular';

import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey('Evaluation_License-_Not_For_Production_Valid_Until_24_June_2019__MTU2MTMzMDgwMDAwMA==954fa1d82f018d12fcd68a8f4e8da359');

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([])
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