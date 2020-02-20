import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { MapComponent } from 'src/app/components/map/map.component';
import {FiltersModule} from '../filters/filters.module';

@NgModule({
  imports: [
    CommonModule,
    FiltersModule
  ],
  declarations: [
    HomeComponent,
    MapComponent
  ],
  exports : [
    CommonModule,
    HomeComponent,
    MapComponent
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
