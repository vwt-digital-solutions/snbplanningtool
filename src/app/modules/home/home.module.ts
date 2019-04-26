import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { EnvService } from 'src/app/services/env.service';
import { MapServiceProvider } from 'src/app/services/map.service.provider';

import { HomeComponent } from './home.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MapComponent, MapsConfig } from 'src/app/components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot(),
    AgmJsMarkerClustererModule,
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    MapComponent
  ],
  exports : [
    CommonModule,
    HomeComponent,
    HeaderComponent,
    MapComponent
  ],
  providers: [
    MapServiceProvider,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [EnvService]
    }
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
