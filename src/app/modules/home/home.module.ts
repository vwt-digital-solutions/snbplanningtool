import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { EnvService } from 'src/app/services/env.service';
import { MapServiceProvider } from 'src/app/services/map.service.provider';

import { HomeComponent } from './home.component';
import { MapComponent, MapsConfig } from 'src/app/components/map/map.component';
import {FilterComponent} from 'src/app/modules/filters/filter.component';
import {FiltersModule} from '../filters/filters.module';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot(),
    AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule,
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
  providers: [
    MapServiceProvider,
    ClusterManager,
    GoogleMapsAPIWrapper,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [EnvService]
    }
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
