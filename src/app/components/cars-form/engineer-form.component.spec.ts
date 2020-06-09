import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { EngineerFormComponent } from './engineer-form.component';
import { EnvServiceProvider } from 'src/app/services/env.service.provider';
import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';
import { CarsService } from 'src/app/services/cars.service';

describe('EngineerFormComponent', () => {
  let component: EngineerFormComponent;
  let fixture: ComponentFixture<EngineerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EngineerFormComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule
      ],
      providers: [
        HttpClient,
        CarsService,
        EnvServiceProvider,
        UrlHelperService,
        OAuthLogger,
        OAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
