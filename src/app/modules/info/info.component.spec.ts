import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { InfoComponent } from './info.component';
import { AgGridModule } from 'ag-grid-angular';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';
import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';
import { CarsInfoFormComponent } from 'src/app/components/cars-info-form/cars-info-form.component';
import { FormsModule } from '@angular/forms';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InfoComponent,
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
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
