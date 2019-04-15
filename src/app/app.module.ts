import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral } from '@agm/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EnvServiceProvider } from './services/env.service.provider';
import { EnvService } from './services/env.service';

@Injectable()
export class MapsConfig implements LazyMapsAPILoaderConfigLiteral{
  public apiKey: string
  constructor(env: EnvService) {
    this.apiKey = env.googleMapsKey
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgmCoreModule.forRoot()
  ],
  providers: [
    EnvServiceProvider,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [EnvService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
