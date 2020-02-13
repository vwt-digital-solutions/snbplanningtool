import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { OAuthService } from 'angular-oauth2-oidc';

import { MapComponent } from './map.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { HeaderComponent } from '../header/header.component';

import { RouterTestingModule } from '@angular/router/testing';

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
        RouterTestingModule,
      ],
      providers: [
        OAuthService,
        HttpClient,
        HttpHandler
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
