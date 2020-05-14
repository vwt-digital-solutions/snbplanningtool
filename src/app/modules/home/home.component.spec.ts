import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';

import { HomeComponent } from './home.component';

import { EnvServiceProvider } from 'src/app/services/env.service.provider';

@Component({
  selector: 'app-map',
  template: ''
})
class MockMapComponent { }

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockMapComponent
      ],
      imports: [
        HttpClientModule
      ],
      providers: [
        HttpClient,
        EnvServiceProvider,
        UrlHelperService,
        OAuthLogger,
        OAuthService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a defined components`, () => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
