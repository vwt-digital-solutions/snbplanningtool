import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CarsInfoFormComponent } from './cars-info-form.component';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';
import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';
import { CarsInfoService } from 'src/app/services/cars-info.service';

describe('CarsInfoFormComponent', () => {
  let component: CarsInfoFormComponent;
  let fixture: ComponentFixture<CarsInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarsInfoFormComponent
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
    fixture = TestBed.createComponent(CarsInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
