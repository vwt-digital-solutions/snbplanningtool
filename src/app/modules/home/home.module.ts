import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { MapComponent } from 'src/app/components/map/map.component';
import {FiltersModule} from '../filters/filters.module';
import {LayerControlComponent} from '../../components/map/layer-control/layer-control.component';
import {AgmCoreModule, LAZY_MAPS_API_CONFIG} from '@agm/core';
import {MapsConfig, MapService} from 'src/app/services/map.service';
import {ApiService} from 'src/app/services/api.service';

@NgModule({
  imports: [
    CommonModule,
    FiltersModule,
    AgmCoreModule.forRoot(),
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
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [ApiService, MapService]
    }
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
