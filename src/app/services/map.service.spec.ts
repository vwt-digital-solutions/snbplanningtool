import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapService
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
    expect(service.config.defaults.lat).toBeDefined();
    expect(service.config.defaults.lng).toBeDefined();
    expect(service.config.defaults.zoomLevel).toBeDefined();
    expect(service.config.minZoom).toBeDefined();
    expect(service.config.styles).toBeDefined();
    expect(service.config.layers).toBeDefined();
  });
});
