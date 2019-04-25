import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthGuard } from "./guards/auth.guard";

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import { InfoModule } from './modules/info/info.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { EnvServiceProvider } from './services/env.service.provider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
    NgbModule,
    HomeModule,
    InfoModule
  ],
  exports: [
    AppComponent,
    HeaderComponent
  ],
  providers: [
    EnvServiceProvider,
    OAuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
