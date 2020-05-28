import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';

import { AgGridModule } from 'ag-grid-angular';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';

import { EngineersComponent } from './engineers.component';
import { EngineerFormComponent } from 'src/app/components/cars-form/engineer-form.component';

describe('CarsComponent', () => {
  let component: EngineersComponent;
  let fixture: ComponentFixture<EngineersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EngineersComponent,
        EngineerFormComponent
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
    fixture = TestBed.createComponent(EngineersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
