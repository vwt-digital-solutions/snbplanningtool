import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { CarsComponent } from './cars.component';
import { AgGridModule } from 'ag-grid-angular';
import { EnvServiceProvider } from '../../services/env.service.provider';
import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';
import { CarsInfoFormComponent } from '../../components/cars-info-form/cars-info-form.component';
import { FormsModule } from '@angular/forms';

describe('CarsComponent', () => {
  let component: CarsComponent;
  let fixture: ComponentFixture<CarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarsComponent,
        CarsInfoFormComponent
      ],
      imports: [
        AgGridModule.withComponents([]),
        HttpClientModule,
        FormsModule
      ],
      providers: [
        HttpClient,
        EnvServiceProvider,
        UrlHelperService,
        OAuthLogger,
        OAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
