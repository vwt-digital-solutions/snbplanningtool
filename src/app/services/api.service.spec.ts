import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UrlHelperService, OAuthLogger, OAuthService } from 'angular-oauth2-oidc';

import { ApiService } from './api.service';
import { EnvService } from './env.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

const envServiceMock = { apiUrl: 'http://localhost' };

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: EnvService, useValue: envServiceMock },
        UrlHelperService,
        OAuthLogger,
        OAuthService,
      ]
    });
  });

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it( 'should get engineers',
    inject(
      [HttpTestingController, ApiService, EnvService],
      (httpMock: HttpTestingController, apiService: ApiService, envService: EnvService) => {
        const mockCars = { features: [], type: 'FeatureCollection' };

        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        apiService.apiGet('/locations/cars').subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Response:
              expect(event.body).toEqual(mockCars);
          }
        });
        const mockReq = httpMock.expectOne(envService.apiUrl + '/locations/cars');

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(mockCars);

        httpMock.verify();
      }
    )
  );
});
