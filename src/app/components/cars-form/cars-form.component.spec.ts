import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CarsFormComponent } from './cars-form.component';
import { EnvServiceProvider } from '../../services/env.service.provider';
import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';
import { CarsInfoService } from '../../services/cars-info.service';

describe('CarsFormComponent', () => {
  let component: CarsFormComponent;
  let fixture: ComponentFixture<CarsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarsFormComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule
      ],
      providers: [
        HttpClient,
        CarsInfoService,
        EnvServiceProvider,
        UrlHelperService,
        OAuthLogger,
        OAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
