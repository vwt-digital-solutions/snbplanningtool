import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import { MapServiceProvider } from './map.service.provider';

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapServiceProvider
      ]
    });
  });

  it('should be created', () => {
    const service: MapService = TestBed.get(MapService);
    expect(service).toBeTruthy();
  });

  it('should define all variables', () => {
    const service: MapService = TestBed.get(MapService);

    expect(service.geoJsonObjectCars).toBeDefined();
    expect(service.geoJsonObjectActive).toBeDefined();
    expect(service.refreshUpdate).toBeUndefined();
    expect(service.refreshStatus).toBeDefined();
    expect(service.refreshStatusClass).toBeDefined();
    expect(service.iconUrlCar).toBeDefined();
    expect(service.iconUrlWork).toBeDefined();
    expect(service.markerLayer).toBeDefined();
    expect(service.clusterUrl).toBeDefined();
    expect(service.clusterStyles).toBeDefined();
    expect(service.lat).toBeDefined();
    expect(service.lng).toBeDefined();
    expect(service.minZoom).toBeDefined();
    expect(service.rotateControlOptions).toBeDefined();
    expect(service.styles).toBeDefined();
  });
});
