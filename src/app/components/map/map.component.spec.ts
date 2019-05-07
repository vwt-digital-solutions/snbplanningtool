import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';

import { EnvServiceProvider } from 'src/app/services/env.service.provider';
import { MapServiceProvider } from 'src/app/services/map.service.provider';
import { EnvService } from 'src/app/services/env.service';

import { MapComponent, MapsConfig } from './map.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { HeaderComponent } from '../header/header.component';

import { RouterTestingModule } from '@angular/router/testing';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        HomeComponent,
        HeaderComponent,
        MapComponent
      ],
      imports: [
        OAuthModule.forRoot(),
        AgmCoreModule.forRoot(),
        AgmJsMarkerClustererModule,
        RouterTestingModule,
        AgmSnazzyInfoWindowModule
      ],
      providers: [
        OAuthService,
        HttpClient,
        HttpHandler,
        EnvServiceProvider,
        MapServiceProvider,
        ClusterManager,
        GoogleMapsAPIWrapper,
        {
          provide: LAZY_MAPS_API_CONFIG,
          useClass: MapsConfig,
          deps: [EnvService]
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
