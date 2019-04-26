import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { EnvServiceProvider } from './services/env.service.provider';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuard } from './guards/auth.guard';

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockRouterOutlet
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        OAuthModule.forRoot(),
        NgbModule
      ],
      providers: [
        EnvServiceProvider,
        OAuthService,
        AuthGuard
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have a defined component'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});

@Component({
  selector: 'app-header',
  template: ''
})
class MockHeaderComponent {}

@Component({
  selector: 'router-outlet',
  template: ''
})
class MockRouterOutlet {}
