import { MapService } from './map.service';

export const MapServiceFactory = () => {
  // Create Map
  const Map = new MapService();

  // Read Mapironment variables from browser window
  const browserWindow = window || {};
  const browserWindowMap = browserWindow['__Map'] || {};

  for (const key in browserWindowMap) {
    if (browserWindowMap.hasOwnProperty(key)) {
      Map[key] = window['__Map'][key];
    }
  }

  return Map;
};

export const MapServiceProvider = {
  provide: MapService,
  useFactory: MapServiceFactory,
  deps: [],
};
