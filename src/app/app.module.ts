import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthGuard } from "./guard/auth.guard";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { MapComponent, MapsConfig } from './components/map/map.component'

import { EnvServiceProvider } from './services/env.service.provider';
import { EnvService } from './services/env.service';
import { MapServiceProvider } from './services/map.service.provider';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AgmCoreModule.forRoot(),
    AgmJsMarkerClustererModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    EnvServiceProvider,
    MapServiceProvider,
    OAuthService,
    AuthGuard,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [EnvService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
