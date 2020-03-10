import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthGuard } from './auth/auth.guard';
import { TokenInterceptor } from './auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import { CarsModule } from './modules/cars/cars.module';
import { WorkModule } from './modules/work/work.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { EnvServiceProvider } from './services/env.service.provider';
import { AuthComponent } from './auth/auth.component';
import {FiltersModule} from './modules/filters/filters.module';
import { WorkItemPopupComponent } from './components/map/popup/workitem/work-item-popup.component';
import { CarInfoPopupComponent } from './components/map/popup/carinfo/car-info-popup.component';
import { PopUpComponent } from './components/map/popup/popup';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    WorkItemPopupComponent,
    CarInfoPopupComponent,
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
    NgbModule,
    HomeModule,
    CarsModule,
    WorkModule,
    FiltersModule
  ],
  exports: [
    AppComponent,
    HeaderComponent
  ],
  providers: [
    EnvServiceProvider,
    OAuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    WorkItemPopupComponent,
    CarInfoPopupComponent
  ]
})
export class AppModule { }
