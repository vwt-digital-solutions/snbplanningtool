import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';

import { AgGridModule } from 'ag-grid-angular';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';

import { CarsComponent } from './cars.component';
import { CarsFormComponent } from 'src/app/components/cars-form/cars-form.component';

describe('CarsComponent', () => {
  let component: CarsComponent;
  let fixture: ComponentFixture<CarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarsComponent,
        CarsFormComponent
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
