import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { LAZY_MAPS_API_CONFIG } from '@agm/core';
import { OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';

import { HomeComponent } from './home.component';
import { MapsConfig } from 'src/app/components/map/map.component';

import { EnvService } from 'src/app/services/env.service';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';
import { MapServiceProvider } from 'src/app/services/map.service.provider';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const activatedRouteMock = {
    paramMap: {
      subscribe: (fn: (value: Data) => void) => fn({
        get() {
          return '123';
        }
      })
    }
  };

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
        MapServiceProvider,
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        },
        {
          provide: LAZY_MAPS_API_CONFIG,
          useClass: MapsConfig,
          deps: [EnvService]
        }
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

@Component({
  selector: 'app-map',
  template: ''
})
class MockMapComponent {}
