import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { MapComponent } from 'src/app/components/map/map.component';
import {FiltersModule} from '../filters/filters.module';
import {LayerControlComponent} from '../../components/map/layer-control/layer-control.component';


@NgModule({
  imports: [
    CommonModule,
    FiltersModule,
  ],
  declarations: [
    HomeComponent,
    MapComponent,
    LayerControlComponent
  ],
  exports : [
    CommonModule,
    HomeComponent,
    MapComponent,
    LayerControlComponent
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
