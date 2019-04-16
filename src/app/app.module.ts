import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EnvServiceProvider } from './services/env.service.provider';
import { EnvService } from './services/env.service';
import { MapServiceProvider } from './services/map.service.provider';
import { MapComponent, MapsConfig } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AgmCoreModule.forRoot()
  ],
  providers: [
    EnvServiceProvider,
    MapServiceProvider,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [EnvService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
